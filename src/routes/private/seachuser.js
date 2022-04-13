const express = require('express');
const dbConnect = require('@src/sql');

const router = express.Router();

router.get('/search', async (req, res) => {
  const { searchKey } = req.query;
  const db = await dbConnect();
  const userinfos = db.collection('userinfos');
  const user = await userinfos.findOne({ username: searchKey }, {
    projection: {'password': 0, '_id': 0}
  })
  if(user) {
    return res.json({
      data: user
    })
  }
  res.json({
    message: 'not found'
  })
})

module.exports = router;