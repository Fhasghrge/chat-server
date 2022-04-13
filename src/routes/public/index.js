const express = require('express');
const router = express.Router();

require("fs")
  .readdirSync(__dirname)
  .filter(filename => filename !== 'index.js')
  .forEach((file) => {
    const apiRouter = require("./" + file);
    router.use(apiRouter)
  });


module.exports = router;