const express = require('express');
const router = express.Router()
const dbConnect = require('@src/sql');

const { hgetall, sismember, hmset } = require('@src/redis');
/** Retrieve the user info based on ids sent */
router.get(`/users`, async (req, res) => {
  const ids = req.query.ids;
  if (typeof ids === "object" && Array.isArray(ids)) {
    /** Need to fetch */
    const usersmap = await findUserByIds(ids);
    const users = {};
    for (let x = 0; x < ids.length; x++) {
      const id = ids[x];
      const user = await hgetall(`user:${id}`);
      if(!user?.username) {
        await hmset(`user:${id}`, ['username', usersmap[id]?.username,]);
      }
      users[id] = {
        id: id,
        email: usersmap[id]?.email,
        username: user?.username || usersmap[id]?.username,
        online: !!(await sismember("online_users", id)),
      };
    }
    return res.send(users);
  }
  return res.sendStatus(404);
});

const findUserByIds = async (ids) => {
  try {
    const db = await dbConnect();
    const userinfos = db.collection('userinfos');
    const dbusers = await userinfos.find({
      'userId': {
        '$in': ids.map(Number)
      }
    }).project({
      'username': 1,
      'userId': 1,
      'email': 1
    }).toArray();
    const map = {};
    dbusers?.forEach(({ userId, ...obj }) => {
      map[userId] = obj;
    })
    return map
  } catch (error) {
    return []
  }
}
module.exports = router;
