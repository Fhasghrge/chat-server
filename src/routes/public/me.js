const express = require('express');
const router = express.Router();

router.get("/me", (req, res) => {
  const { user } = req.session;
  if (user) {
    return res.json(user);
  }
  return res.json(null);
});

module.exports = router;