const chalk = require('chalk');
const {
  client: redisClient,
  exists,
  sadd,
  zadd,
  hmget,
  srem
} = require('@src/redis')
const { sanitise } = require('@src/utils');
const { SERVER_ID } = require('@src/config');

const publish = (type, data) => {
  const outgoing = {
    serverId: SERVER_ID,
    type,
    data,
  };
  redisClient.publish("MESSAGES", JSON.stringify(outgoing));
};


module.exports = (io) => async (socket) => {
  console.log(chalk.green('socket connnected!!!!'));
  if (socket.request.session.user === undefined) {
    return;
  }
  const userId = socket.request.session.user.id;
  await sadd("online_users", userId);

  const msg = {
    ...socket.request.session.user,
    online: true,
  };

  publish("user.connected", msg);
  socket.broadcast.emit("user.connected", msg);

  socket.on("room.join", (id) => {
    socket.join(`room:${id}`);
  });

  socket.on(
    "message",
    async (message) => {
      console.log('logger=>>', message);
      message = { ...message, message: sanitise(message.message) };

      await sadd("online_users", message.from);

      const messageString = JSON.stringify(message);
      const roomKey = `room:${message.roomId}`;
      /**
       * It may be possible that the room is private and new, so it won't be shown on the other
       * user's screen, check if the roomKey exist. If not then broadcast message that the room is appeared
       */
      const isPrivate = !(await exists(`${roomKey}:name`));
      const roomHasMessages = await exists(roomKey);
      if (isPrivate && !roomHasMessages) {
        const ids = message.roomId.split(":");
        const msg = {
          id: message.roomId,
          names: [
            await hmget(`user:${ids[0]}`, "username"),
            await hmget(`user:${ids[1]}`, "username"),
          ],
        };
        publish("show.room", msg);
        socket.broadcast.emit(`show.room`, msg);
      }
      await zadd(roomKey, "" + message.date, messageString);
      publish("message", message);
      io.to(roomKey).emit("message", message);
    }
  );
  socket.on("disconnect", async () => {
    console.log(chalk.red('Socket disconnected'));
    const userId = socket.request.session.user.id;
    await srem("online_users", userId);
    const msg = {
      ...socket.request.session.user,
      online: false,
    };
    publish("user.disconnected", msg);
    socket.broadcast.emit("user.disconnected", msg);
  });

}