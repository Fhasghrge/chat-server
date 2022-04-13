
const express = require('express');
const { sadd, smembers } = require('@src/redis')
const router = express.Router();

router.get('/addFriends', async (req, res) => {
  const friId = req.query.friId;
  const {id} = req.session.user;
  const userFriKey = `user:${id}:friends`

  if(!friId){
    return res.json({
      errcode: 1,
      message: 'error user id'
    })
  }

  if(await sadd(userFriKey, `${friId}`)) {
    const friends = await smembers(userFriKey)
    res.json({
      errcode: 0,
      data: {
        friends
      }
    })
  }else {
    res.json({
      errcode: 1,
      message: '添加失败'
    })
  }

})


module.exports = router;


