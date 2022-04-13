const express = require('express');
const router = express.Router()

const { get } = require('@src/redis');
const { getMessages } = require('@src/utils');

/** Fetch messages from the general chat (just to avoid loading them only once the user was logged in.) */
router.get("/room/0/preload", async (req, res) => {
  const roomId = "0";
  try {
    let name = await get(`room:${roomId}:name`);
    const messages = await getMessages(roomId, 0, 20);
    return res.status(200).send({ id: roomId, name, messages });
  } catch (err) {
    return res.status(400).send(err);
  }
});

module.exports = router;