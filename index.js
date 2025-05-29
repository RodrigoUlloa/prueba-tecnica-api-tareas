const express = require('express');
const { Server } = require('socket.io');
const { createServer } = require('http');
const db = require('./db');

const app = express();
const server = createServer(app);
const io = new Server(server);

const routes = require('./routes')(io);

app.use(express.json());

app.use('/', routes);
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (socket) => {
  socket.on('event message', (msg) => {
    io.emit('was', msg);
  });
});

// app.listen(3000),
//   () => {
//     console.log('Server express is running at port', PORT);
//   };

io.on('connection', (socket) => {
  const endpoint = require('./endpoint');
  socket.emit('tasks', endpoint.getTasks());
  socket.on('event message', (msg) => {
    io.emit('was', msg);
  });
});

server.listen(3000, () => {
  console.log('server websocket running at http://localhost:3000');
});

process.on('SIGINT', () => {
  db.close();
  process.exit(0);
});
