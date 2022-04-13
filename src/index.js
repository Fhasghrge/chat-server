const chalk = require('chalk');
require('module-alias/register');
require('dotenv').config();

const { initData } = require('./utils/initdata.js');
const { auth: runRedisAuth } = require('./redis');
const server = require('./app');
const { PORT } = require('./config');
const log = console.log;

const exitHandler = () => {
  server?.close(() => {
    log(chalk.blue('Server closed'))
  })
}

const unexpectedErrorHandler = (error) => {
  log(chalk.red(error))
  exitHandler()
}

process.on('uncaughtException', unexpectedErrorHandler)
process.on('unhandledRejection', unexpectedErrorHandler)

;(async () => {
  await runRedisAuth();
  await initData()

  if (process.env.PORT) {
    server.listen(+PORT, "0.0.0.0", () =>
      console.log(`Listening on ${PORT}...`)
    );
  } else {
    server.listen(+PORT, () => console.log(`Listening on ${PORT}...`));
  }
})()
