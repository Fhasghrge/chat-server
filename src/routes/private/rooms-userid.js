const express = require('express');
const router = express.Router()

const {
  get,
  exists,
  smembers,
  hmget,
} = require('@src/redis.js')

router.get(`/rooms/:userId`, async (req, res) => {
  const userId = req.params.userId;
  const roomIds = await smembers(`user:${userId}:rooms`);
  const rooms = [];
  for (let x = 0; x < roomIds.length; x++) {
    const roomId = roomIds[x];

    let name = await get(`room:${roomId}:name`);
    if (!name) {
      const roomExists = await exists(`room:${roomId}`);
      if (!roomExists) {
        continue;
      }

      const userIds = roomId.split(":");
      if (userIds.length !== 2) {
        return res.sendStatus(400);
      }
      rooms.push({
        id: roomId,
        names: [
          await hmget(`user:${userIds[0]}`, "username"),
          await hmget(`user:${userIds[1]}`, "username"),
        ],
      });
    } else {
      rooms.push({ id: roomId, names: [name] });
    }
  }
  res.status(200).send(rooms);
});

module.exports = router;