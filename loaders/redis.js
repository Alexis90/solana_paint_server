const { createClient } = require('redis');
require('dotenv').config({ path: '../.env' });


const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
const REDIS_PORT = process.env.REDIS_PORT || 6379;

// Create Redis client
const redisClient = createClient({
  url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
});

// Handle Redis connection events
redisClient.on('connect', () => {
  console.log('Connected to Redis successfully.');
});

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err.message);
});

// Connect the client
(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error('Failed to connect to Redis:', err.message);
  }
})();

module.exports = redisClient;
