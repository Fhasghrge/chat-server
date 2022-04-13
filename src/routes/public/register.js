const express = require('express');
const bcrypt = require('bcryptjs');
const dbConnect = require('@src/sql');
const { setVertify } = require('@src/utils/sendEmail');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const db = await dbConnect();
    const userInfos = db.collection('userinfos');
    const hashedPassword = await bcrypt.hash(password, 10);

    if (await userInfos.countDocuments({ username })) {
      return res.json({
        code: 401,
        message: 'user existed'
      })
    }

    await db.collection('userinfos').insertOne({
      username,
      password: hashedPassword,
      email,
      vertify: false,
      createDate: Date.now()
    })
    await setVertify({ username, email });

  } catch (error) {
    return res.json({
      code: 1,
      message: error.message
    })
  }

  return res.json({
    code: 0,
    data: {
      username
    }
  })
})

module.exports = router;
