const express = require('express');
const dbConnect = require('@src/sql');

const router = express.Router();

router.post('/updateInfos', async (req, res) => {
  const updataData = req.body;
  const targetUserId = req.session.user.id;
  const db = await dbConnect();
  const userinfos = db.collection('userinfos');
  const user = await userinfos.findOneAndUpdate({ userId: targetUserId }, {
    '$set': {
      ...updataData
    }
  })
  if (user) {
    return res.json({
      data: user
    })
  }
  res.json({
    errcode: 1,
    message: 'update fail'
  })
})

module.exports = router;