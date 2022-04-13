const express = require('express');
const router = express.Router()

const { createPrivateRoom } = require('@src/utils')

router.post("/room", async (req, res) => {
  const { user1, user2 } = {
    user1: parseInt(req.body.userid),
    user2: parseInt(req.session.user.id),
  };

  const [result, hasError] = await createPrivateRoom(user1, user2);
  if (hasError) {
    return res.sendStatus(400);
  }
  return res.status(201).send(result);
});

module.exports = router;
