const { Redis } = require('@upstash/redis');
const jwt = require('jsonwebtoken');

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') return { statusCode: 405, body: 'Method Not Allowed' };

  const authHeader = event.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    // 1. Validate JWT signature and expiry
    const decoded = jwt.verify(token, process.env.APP_JWT_SECRET);
    
    // 2. Check Entitlement Store (Source of Truth)
    const status = await redis.get(`entitlement:${decoded.license_key}`);
    
    if (status === 'active') {
      // Issue rolling session token
      const newToken = jwt.sign({ license_key: decoded.license_key }, process.env.APP_JWT_SECRET, { expiresIn: '7d' });
      return { 
        statusCode: 200, 
        body: JSON.stringify({ valid: true, token: newToken }) 
      };
    } else {
      return { statusCode: 401, body: JSON.stringify({ error: 'Subscription is no longer active.' }) };
    }
  } catch (e) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Invalid or expired session.' }) };
  }
};
