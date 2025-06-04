
const express = require('express'); // <-- You forgot this line
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:5174', // Replace with your React app's URL/port
    methods: ['GET', 'POST'],
  },
});

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('Someone is there!');
  socket.broadcast.emit('message', '🚨 Someone Just Visited HOLY CONCEPT WEBSITE!');
});

server.listen(3000, () => {
  console.log('Server is running at http://localhost:3000');
});
