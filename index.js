import express, { json } from 'express';
const __dirname = import.meta.dirname;
import { createServer } from 'http';
import { Server } from 'socket.io';
import { getRouter } from './routes.js';
import { getTasks } from './queries.js';
import { closeDB } from './db.js';

const app = express();
export const server = createServer(app);
const io = new Server(server);
const router = getRouter(io);

app.use(json());
app.use('/', router);
app.get('/', (_req, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
});

io.on('connection', (socket) => {
  socket.emit('tasks', getTasks());
});

server.listen(3000, () => {
  console.log('server websocket running at http://localhost:3000');
});

process.on('SIGINT', () => {
  closeDB();
  process.exit(0);
});
