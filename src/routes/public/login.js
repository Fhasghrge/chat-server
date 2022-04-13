const express = require('express');
const bcrypt = require('bcryptjs');
const dbConnect = require('@src/sql');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const db = await dbConnect();
    const userInfos = db.collection('userinfos');
    const user = await userInfos.findOne({username});
    
    if(!user) {
      return res.json({ code: 1, message: "Username not existed" });
    }
    if(!await bcrypt.compare(password, user.password)) {
      return res.json({ code: 1, message: "Password Error" });
    }
    if(!user['vertify']) {
      return res.json({code: 1, message: 'Not vertified'})
    }

    const userSession = { id: user['userId'], username };
    req.session.user = userSession;
    return res.json(userSession);
  } catch (error) {
    res.json({message: error.message})
  }
})

module.exports = router;
