const express = require('express');
const router = express.Router();

router.post('/logout', (req, res) => {
  req.session.destroy(() => {});
  return res.sendStatus(200);
})

module.exports = router;