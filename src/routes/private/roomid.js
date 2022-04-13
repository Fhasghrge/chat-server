const express = require('express');
const router = express.Router()

const { getMessages } = require('@src/utils')

/** Fetch messages from a selected room */
router.get("/room/:id/messages", async (req, res) => {
  const roomId = req.params.id;
  const offset = +req.query.offset;
  const size = +req.query.size;
  try {
    const messages = await getMessages(roomId, offset, size);
    return res.status(200).send(messages);
  } catch (err) {
    return res.status(400).send(err);
  }
});

module.exports = router;