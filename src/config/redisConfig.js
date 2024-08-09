const { createClient } = require("redis");
const dotenv = require("dotenv");

dotenv.config();

const client = createClient({
  // port: 6379,
  // host: process.env.REDIS_URL,
  url: process.env.REDIS_URL,
});

client.on("connect", () => {
  console.log("client connected to redis!");
});

client.on("ready", () => {
  console.log("client connected to redis and ready to use!");
});

client.on("error", (error) => {
  console.log(error.message);
});

client.on("end", () => {
  console.log("client disconnected from redis!");
});

process.on("SIGINT", () => {
  client.quit();
});

module.exports = client;
