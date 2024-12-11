const express = require('express');
const { Server } = require('socket.io');
require('dotenv').config();

const socketHandler = require('./socket');
const balanceWorker = require('./worker');


const app = express();
const server = require('http').createServer(app);
const io = new Server(server);

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ data: 'Paint Server Backend running' });
});

socketHandler(io);

balanceWorker();

app.use('/api', require('./routes/index'));

app.use(function (req, res, next) {
  res
    .status(404)
    .json({ error: `The requested URL ${req.originalUrl} was not found.` });
});

app.use(function (error, req, res, next) {
  res
    .status(error.status || 500)
    .json({ error: error.message || 'Something went wrong' });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
