const { Server } = require("socket.io");

const initializeSocket = (server) => {
  return new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
    },
  });
};

module.exports = { initializeSocket };
