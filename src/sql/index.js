const { MongoClient } = require('mongodb');
const chalk = require('chalk');
const { MONGODB_USER, MONGODB_PASSWORD } = process.env;
const url = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@cluster0.b0jfq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(url);
const log = console.log;

function getDB() {
  let db;
  client.close((err) => {
    log(chalk.red(`MongoDB disconnected: ${err?.message || 'unkown error'}`));
    db = undefined;
  })
  return async () => {
    if (db) return db;
    await client.connect()
    log(chalk.green(`🎉 MongoDB connected`))
    return db = client.db('chat');
  }
}

module.exports = getDB();