const express = require('express');
const randomName = require('node-random-name');

const router = express.Router();

router.get("/randomname", (_, res) => {
  return res.send(randomName({ first: true }));
});

module.exports = router;