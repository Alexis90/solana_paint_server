const redisClient = require('./loaders/redis');
const web3Service = require('./services/web3Service');

const PIXELS_KEY = 'pixelsToSave';

module.exports = (io) => {
  io.on('connection', async (socket) => {
    socket.on('connectWallet', async (data) => {
      let isHolder;

      try {
        const balance = await web3Service.getTokenBalance(data.walletAddress);
        if (balance > 0) {
          isHolder = true;
        } else {
          isHolder = false;
        }
        await redisClient.hSet(`wallet-${data.walletAddress}`, {
          isHolder,
        });

        console.log(`${data.walletAddress} connected.`);
      } catch (error) {
        console.log(
          `Error connecting user ${data.walletAddress}:`,
          error.message
        );
        socket.emit('error', { error: 'Failed to verify token balance.' });
        socket.disconnect();
      }
    });

    socket.on('drawPixel', async (data) => {
      try {
        socket.broadcast.emit('pixelUpdated', {
          x: data.x,
          y: data.y,
          color: data.color,
        });

        const user = await redisClient.hGet(`wallet-${data.walletAddress}`);

        if (user && user.isHolder) {
          const pixelData = {
            x: data.x,
            y: data.y,
            color: data.color,
            wallet_address: data.walletAddress,
            created_at: new Date().toISOString(),
          };
          await redisClient.rPush(PIXELS_KEY, JSON.stringify(pixelData));
        }
      } catch (error) {
        console.error('Failed to process drawPixel:', error);
        socket.emit('error', { error: 'Failed to update pixel' });
      }
    });

    socket.on('disconnect', async (data) => {
      try {
        const user = await redisClient.hGet(data.walletAddress);
        if (user) await redisClient.del(data.walletAddress);
      } catch (error) {
        console.error(
          `Error disconnecting user ${data.walletAddress}:`,
          error.message
        );
      }
    });
  });
};
