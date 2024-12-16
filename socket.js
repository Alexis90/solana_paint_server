const redisClient = require('./loaders/redis');
const web3Service = require('./services/web3Service');

const PIXELS_KEY = 'pixelsToSave';
const REDIS_EXPIRATION_TIME = 4 * 60 * 60; // 4HOUSE

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
        await redisClient.set(
          `wallet-${data.walletAddress}`,
          isHolder.toString(),
          {
            EX: REDIS_EXPIRATION_TIME, // Expire after 1 hour (3600 seconds)
          }
        );

        console.log(`${data.walletAddress} connected.`);
      } catch (error) {
        console.log(
          `Error connecting user ${data.walletAddress}:`,
          error.message
        );
        socket.emit('error', {
          message: 'Failed to connect wallet, please retry',
        });
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

        const user = await redisClient.get(`wallet-${data.walletAddress}`);

        if (user) {
          const pixelData = {
            x: data.x.toString(),
            y: data.y.toString(),
            color: data.color,
            wallet_address: data.walletAddress,
            created_at: new Date().toISOString(),
          };
          await redisClient.rPush(PIXELS_KEY, JSON.stringify(pixelData));
        }
      } catch (error) {
        console.error('Failed to process drawPixel:', error);
        socket.emit('error', { message: 'Failed to update pixel' });
      }
    });

    socket.on('disconnect', async () => {
      console.log('A user disconnected');
    });
  });
};
