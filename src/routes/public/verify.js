const express = require('express');
const AES = require('crypto-js/aes');
const CryptoJS = require("crypto-js");

const dbConnect = require('@src/sql');
const { createUser } = require('@src/utils')

const router = express.Router();
const { AES_SECRET } = process.env;

router.get('/vertify/:key*', async (req, res) => {
  const vertifyKey = req.params.key + req.params[0];
  const username = AES.decrypt(vertifyKey, AES_SECRET)
    .toString(CryptoJS.enc.Utf8)
    .split(':')[1];

  const db = await dbConnect();
  const userInfos = db.collection('userinfos');

  if (await userInfos.countDocuments({ username })) {
    try {
      const { id: nextId } = await createUser(username);
      await userInfos.updateOne(
        { username },
        {
          $set:
            { vertify: true, userId: nextId }
        }
      )
      return res.send('Successful vertify')
    } catch (error) {
      res.send(`${username} not register`);
      throw (new Error(error.message | '验证失败'));
    }
  }
})

module.exports = router;