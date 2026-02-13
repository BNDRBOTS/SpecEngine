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

    const isValid = data.success 
      && !data.purchase.refunded 
      && !data.purchase.chargebacked 
      && !data.purchase.subscription_ended_at; 

    if (isValid) {
      await redis.set(`entitlement:${license_key}`, 'active');
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
    return { statusCode: 502, body: JSON.stringify({ error: 'Failed to communicate with licensing server.' }) };
  }
};
