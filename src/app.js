const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const RedisStore = require("connect-redis")(session);
// const fileUpload = require('express-fileupload');
const path = require("path");
const compress = require('compression');

const {
  client: redisClient,
  sub,
} = require("./redis");
const { SERVER_ID } = require("./config");
const router = require('./routes');
const socketHandle = require('./socket')

const app = express(),
    server = require("http").createServer(app),
    io = require("socket.io")(server);

const sessionMiddleware = session({
  store: new RedisStore({ client: redisClient }),
  secret: "keyboard cat",
  saveUninitialized: true,
  resave: true,
});

const initPubSub = () => {
  sub.on("message", (_, message) => {
    const { serverId, type, data } = JSON.parse(message);
    if (serverId === SERVER_ID) {
      return;
    }
    io.emit(type, data);
  });
  sub.subscribe("MESSAGES");
};

io.use((socket, next) => {
  sessionMiddleware(socket.request, socket.request.res || {}, next);
});

io.on("connection", socketHandle(io));

// app.use(fileUpload({
//   createParentPath: true,
//   limits: {
//     fileSize: 2 * 1024 * 1024 * 1024 //2MB max file(s) size
//   },
// }));
app.use(compress())
app.use(bodyParser.json());
app.use('/static', express.static(__dirname + '/uploads'));
app.use("/", express.static(path.dirname(__dirname) + "/client/build"));

// initPubSub();

app.use(sessionMiddleware);
app.use('/api', router);

module.exports = server;
