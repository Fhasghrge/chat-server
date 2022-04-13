const express = require('express');
const router = express.Router();

const auth = (req, res, next) => {
  if (!req.session.user) {
    return res.sendStatus(403);
  }
  next();
};

router.use(auth);

require("fs")
  .readdirSync(__dirname)
  .filter(filename => filename !== 'index.js')
  .forEach((file) => {
    const apiRouter = require("./" + file);
    router.use(apiRouter)
  });

module.exports = router;