const { Redis } = require('@upstash/redis');
const jwt = require('jsonwebtoken');

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  
  let license_key;
  try {
    const body = JSON.parse(event.body);
    license_key = body.license_key;
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }

  if (!license_key) return { statusCode: 400, body: JSON.stringify({ error: 'Missing license key' }) };

  // 1. Basic Rate Limiting
  const ip = event.headers['x-nf-client-connection-ip'] || 'unknown';
  const rlKey = `rl:verify:${ip}`;
  const attempts = await redis.incr(rlKey);
  if (attempts === 1) await redis.expire(rlKey, 60); // 1 minute window
  if (attempts > 10) return { statusCode: 429, body: JSON.stringify({ error: 'Too many verification attempts. Try again later.' }) };

  // 2. Verify with Gumroad
  const params = new URLSearchParams({
    product_permalink: process.env.GUMROAD_PRODUCT_PERMALINK,
    license_key: license_key
  });

  try {
    const res = await fetch('https://api.gumroad.com/v2/licenses/verify', {
      method: 'POST',
      body: params
    });
    
    const data = await res.json();

    // 3. Strict state enforcement: must be successful, not refunded, not chargebacked, and active
    if (data.success && !data.purchase.refunded && !data.purchase.chargebacked && !data.purchase.subscription_cancelled_at) {
      
      // Store entitlement server-side
      await redis.set(`entitlement:${license_key}`, 'active');
      
      // Issue signed session token
      const token = jwt.sign({ license_key }, process.env.APP_JWT_SECRET, { expiresIn: '7d' });
      
      return {
        statusCode: 200,
        body: JSON.stringify({ token })
      };
    } else {
      return { 
        statusCode: 403, 
        body: JSON.stringify({ error: 'Invalid, expired, or refunded license key.' }) 
      };
    }
  } catch (e) {
    console.error('Gumroad API Error:', e);
    // FAIL CLOSED on server errors
    return { statusCode: 502, body: JSON.stringify({ error: 'Failed to communicate with licensing server.' }) };
  }
};
