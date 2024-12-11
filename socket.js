const redisClient = require('./loaders/redis');
const pixelService = require('./services/pixelService');
const accountService = require('./services/accountService');
const web3Service = require('./services/web3Service');
require('dotenv').config();

const PIXELS_PER_TOKEN = process.env.PIXELS_PER_TOKEN;

module.exports = (io) => {
  io.on('connection', async (socket) => {
    const { walletAddress } = socket.handshake.query;

    try {
      const historicalUsage = await accountService.getHistoricalPixelUsage(
        walletAddress
      );

      const totalPixelUsed = historicalUsage ? historicalUsage.pixelUsed : 0;

      const balance = await web3Service.getTokenBalance(walletAddress);

      const availablePixels = balance * PIXELS_PER_TOKEN - totalPixelUsed;

      if (availablePixels <= 0) {
        socket.emit('error', { error: 'Insufficient tokens to draw pixels' });
        socket.disconnect();
        return;
      }

      await redisClient.hSet(walletAddress, {
        socketId: socket.id,
        historicalUsage,
        balance,
        availablePixels,
        pixelDrawn: 0,
      });
    } catch (error) {
      console.log(`Error connecting user ${walletAddress}:`, error.message);
      socket.emit('error', { error: 'Failed to verify token balance.' });
      socket.disconnect();
    }

    socket.on('drawPixel', async (data) => {
      try {
        // retrieve player
        const account = await redisClient.hGetAll(walletAddress);

        if (!account || account?.availablePixels <= 0) {
          socket.emit('error', { error: 'Insufficient tokens to draw pixels' });
          socket.disconnect();
          return;
        }

        await redisClient.hSet(walletAddress, {
          pixelDrawn: account.pixelDrawn + 1,
          availablePixels: account.availablePixels - 1,
        });
        await pixelService.insertPixels(data);
        socket.broadcast.emit('pixelUpdated', data);
      } catch (error) {
        socket.emit('error', { error: 'Failed to update pixel' });
      }
    });

    socket.on('disconnect', async () => {
      try {
        const account = await redisClient.hGet(walletAddress);

        if (account) {
          await accountService.persistAccount(
            walletAddress,
            +account.pixelDrawn
          );
          await redisClient.del(walletAddress);
        }
      } catch (error) {
        console.error(
          `Error disconnecting user ${walletAddress}:`,
          error.message
        );
      }
    });
  });
};
