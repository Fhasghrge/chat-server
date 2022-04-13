const express = require('express');
const router = express.Router()

const publicRouter = require('./public');
const privateRouter = require('./private')

// notice the order
router
  .use(publicRouter)
  .use(privateRouter)

module.exports = router;
