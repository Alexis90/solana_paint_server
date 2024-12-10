const pixelService = require('./services/pixelService');

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('drawPixel', async (data) => {
      try {
        await pixelService.insertPixels(data);
        socket.broadcast.emit('pixelUpdated', data);
      } catch (error) {
        socket.emit('error', { error: 'Failed to update pixel' });
      }
    });
  });
};
