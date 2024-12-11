const redisClient = require('./loaders/redis');
const web3Service = require('./services/web3Service');
require('dotenv').config();

const PIXELS_PER_TOKEN = process.env.PIXELS_PER_TOKEN;

async function verifyActiveUsers() {
  const activeUsers = await redisClient.keys('*');

  for (const walletAddress of activeUsers) {
    try {
      const user = await redisClient.hGetAll(walletAddress);
      const balance = await web3Service.getTokenBalance(walletAddress);

      const availablePixels =
        balance * PIXELS_PER_TOKEN - user.pixelDrawn;

      if (availablePixels <= 0) {
        const socket = global.io.sockets.sockets.get(user.socketId);
        if (socket) {
          socket.emit('error', {
            message: 'Insufficient tokens to continue drawing.',
          });
        }
        await redisClient.hSet(walletAddress, { balance, availablePixels: 0 });
      } else {
        await redisClient.hSet(walletAddress, { balance, availablePixels });
      }
    } catch (error) {
      console.error(
        `Error verifying balance for ${walletAddress}:`,
        error.message
      );
    }
  }
}

// interval: every 10 mins
module.exports = () => {
  console.log('Balance worker started...');
  setInterval(verifyActiveUsers, 10 * 60 * 1000);
};
