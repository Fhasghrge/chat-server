const express = require('express');
const moment = require('moment');
const { set, incr, exists, sadd, zadd } = require('@src/redis')
const router = express.Router();


router.post('/createGroup', async (req, res) => {
  try {
    const users = req.body?.groups || [];
    const groupName = req.body?.groupName;
    const {
      id: fromUserId,
      username: fromUserName
    } = req.session.user;

    const defaultName =
      ""
      + fromUserName
      + ' create at '
      + moment().format('MMMM Do YYYY, h:mm:ss a').toString();

    const groupId = await createGroup(groupName || defaultName);

    // add each user this created room
    [fromUserId, ...users].forEach(async (userId) => {
      await sadd(`user:${Number(userId)}:rooms`, `${groupId}`);
    });
    // init message to load each contact
    const initMessage = JSON.stringify({
      roomId: groupId,
      bot: true,
      message: `${fromUserName} 创建了该群聊`,
      from: fromUserId,
      date: moment(new Date()).unix(),
    })
    await zadd(`room:${groupId}`,
      "" + moment(new Date()).unix(),
      initMessage);
    res.status(200).json({id: groupId, names: [groupName]} )
  } catch (err) {
    res.status(500).json({ message: err.message || 'create group error' })
  }
})

const createGroup = async (defaultName) => {
  const totalGroupsExist = await exists("total_groups");

  if (!totalGroupsExist) {
    await set('total_groups', 1001);
    await set(`room:${1001}:name`, defaultName)
    return 1001;
  }

  const nextId = await incr("total_groups");
  await set(`room:${nextId}:name`, defaultName);
  return nextId;
}


module.exports = router;