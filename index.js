const express = require('express');
const { Server } = require('socket.io');

const app = express();
const { PORT } = 3000; //usalmente uso un env

app.listen(PORT),
  () => {
    console.log('Server is running at port', PORT);
  };
