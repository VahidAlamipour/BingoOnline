const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');
const router = require('./router');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

const socket = require('./socket')(io);
app.use(cors());
app.use(router);
const port = process.env.PORT || 3400;
server.listen(port, () => console.log(`started on ${port}`));