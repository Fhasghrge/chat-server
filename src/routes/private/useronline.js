const express = require('express');
const router = express.Router()

const { smembers, hgetall } = require('@src/redis');

/** Check which users are online. */
router.get(`/users/online`, async (req, res) => {
  const onlineIds = await smembers(`online_users`);
  const users = {};
  for (let onlineId of onlineIds) {
    const user = await hgetall(`user:${onlineId}`);
    users[onlineId] = {
      id: onlineId,
      username: user?.username,
      online: true,
    };
  }
  return res.send(users);
});

module.exports = router;