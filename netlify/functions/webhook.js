const { Redis } = require('@upstash/redis');

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  // 1. Verify Authentication via Query Param Secret
  const secret = event.queryStringParameters.secret;
  if (secret !== process.env.GUMROAD_WEBHOOK_SECRET) {
    console.warn('Unauthorized webhook attempt');
    return { statusCode: 401, body: 'Unauthorized webhook' };
  }

  // 2. Parse Payload (Gumroad sends form-urlencoded for webhooks)
  let payload;
  try {
    if (event.headers['content-type']?.includes('application/x-www-form-urlencoded')) {
      payload = Object.fromEntries(new URLSearchParams(event.body));
    } else {
      payload = JSON.parse(event.body);
    }
  } catch (e) {
    return { statusCode: 400, body: 'Invalid payload' };
  }

  const licenseKey = payload.license_key;
  if (!licenseKey) {
    // Return 200 to acknowledge webhook idempotently if irrelevant data was sent
    return { statusCode: 200, body: 'No license key, ignoring.' };
  }

  // 3. Determine Revocation State
  const isRevoked = 
    payload.refunded === 'true' || payload.refunded === true ||
    payload.chargebacked === 'true' || payload.chargebacked === true ||
    (payload.subscription_cancelled_at && payload.subscription_cancelled_at !== 'null' && payload.subscription_cancelled_at !== '');

  // 4. Update Entitlement Store (Idempotent)
  if (isRevoked) {
    await redis.set(`entitlement:${licenseKey}`, 'revoked');
    console.log(`Access revoked for: ${licenseKey}`);
  } else {
    // Handles renewals and standard rebills
    await redis.set(`entitlement:${licenseKey}`, 'active');
    console.log(`Access activated/renewed for: ${licenseKey}`);
  }

  return { statusCode: 200, body: 'Processed successfully' };
};
