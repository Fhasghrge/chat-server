const express = require('express');
const { exists, smembers } = require('@src/redis')
const router = express.Router();

router.get('/allFriends', async (req, res) => {
  const { id, username } = req.session.user;
  const userFriKey = `user:${id}:friends`
  if(await exists(userFriKey)) {
    const friends = await smembers(userFriKey)
    res.json({errcode: 0, data: {
      username,
      friends 
    }})
  }else{
    res.json({
      errcode: 0,
      data: {
        username,
        friends: []
      }
    })
  }
})

module.exports = router;