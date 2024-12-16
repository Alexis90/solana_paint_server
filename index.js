const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
require('dotenv').config();

const socketHandler = require('./socket');
const balanceWorker = require('./worker');

const app = express();
const server = require('http').createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow requests from this origin
    methods: ['GET', 'POST'], // Specify allowed HTTP methods
  },
});
app.use(cors({ origin: '*' }));
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
