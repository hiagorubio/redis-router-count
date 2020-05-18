var express = require('express');
var router = express.Router();
const redis = require('redis');
const { promisify } = require("util");

const redisPort = 6379;
const redisHost = '127.0.0.1';
const redisClient = redis.createClient(redisPort, redisHost);

let count = 0;

redisClient.get("routerCounter", async (err, res) => {
  if (err) {
    return;
  }
  if (!res) {
    redisClient.set("routerCounter", '0', redisClient.print);
  }
  return { res };
});

/* GET home page. */
router.get('/redis-counter', (req, res, next) => {
  const actualCount = redisClient.get("routerCounter", (err, reply) => {
    const newCount = Number(reply) + 1;
    redisClient.set('routerCounter', newCount, redisClient.print);
    res.status(200).send(`Actual router counter is ${newCount}`);
  });
});

module.exports = router;
