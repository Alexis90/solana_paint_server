const redisClient = require('./loaders/redis');
const postgres = require('./loaders/postgres');
const web3Service = require('./services/web3Service');
require('dotenv').config();

const PIXELS_KEY = 'pixelsToSave';
const IS_HOLDER_CHECK_INTERVAL = 60 * 60 * 1000; // 1 hour in ms
const BATCH_INSERT_INTERVAL = 5 * 60 * 1000; // 5 minutes in ms
const BATCH_SIZE = 100; // Number of pixels to process in each batch

async function updateIsHolder() {
  try {
    // Fetch all wallet addresses stored in Redis
    const keys = await redisClient.keys('wallet-*');
    for (const walletAddress of keys) {
      const user = await redisClient.hGet(walletAddress);
      if (user) {
        const walletAddress = walletKey.split('-')[1]; // Extract wallet address
        const balance = await web3Service.getTokenBalance(walletAddress);
        const isHolder = balance > 0;
        await redisClient.hSet(walletKey, { isHolder });
      }
    }
    console.log('Updated isHolder status for all wallets.');
  } catch (error) {
    console.error('Error updating isHolder status:', error);
  }
}

async function bactInsertPixels() {
  try {
    const pixels = await redisClient.lRange(PIXELS_KEY, 0, BATCH_SIZE - 1);
    if (pixels.length === 0) return;

    const parsedPixels = pixels.map((pixel) => JSON.parse(pixel));

    await postgres.batchInsert('pixel_state', parsedPixels, BATCH_SIZE);

    await redisClient.lTrim(PIXELS_KEY, pixels.length, -1);

    console.log(`Inserted ${pixels.length} pixels into PostgreSQL.`);
  } catch (error) {
    console.error('Error inserting pixels into PostgreSQL:', error);
  }
}

module.exports = () => {
  console.log('Balance worker started...');
  setInterval(updateIsHolder, IS_HOLDER_CHECK_INTERVAL);
  setInterval(bactInsertPixels, BATCH_INSERT_INTERVAL);
};
