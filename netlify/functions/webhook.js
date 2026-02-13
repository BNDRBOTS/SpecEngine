const { Redis } = require('@upstash/redis');

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

exports.handler = async (event) => {
  const SUCCESS_RESPONSE = { statusCode: 200, body: 'Received' };

  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  try {
    const payload = new URLSearchParams(event.body);
    
    const resource_name = payload.get('resource_name'); 
    const license_key = payload.get('license_key');
    const product_permalink = payload.get('product_permalink'); 

    if (process.env.GUMROAD_PRODUCT_PERMALINK && product_permalink !== process.env.GUMROAD_PRODUCT_PERMALINK) {
       return SUCCESS_RESPONSE;
    }

    if (!license_key) return SUCCESS_RESPONSE;

    const shouldRevoke = 
      resource_name === 'refund' || 
      resource_name === 'chargeback' || 
      resource_name === 'dispute'; 

    if (shouldRevoke) {
      await redis.del(`entitlement:${license_key}`);
    }

    return SUCCESS_RESPONSE;

  } catch (error) {
    return { statusCode: 500, body: 'Server Error' };
  }
};
