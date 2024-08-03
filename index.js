// "This is the delegate backend server to use it like to do other tasks to make primary next js backend fast"

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { initializeSocket } = require("./socket");
const { authRoutes } = require("./src/routes/authRoutes");
const { connectDb } = require("./src/config/dbConfig");

dotenv.config();

//express app
const app = express();

//Add current app
const server = http.createServer(app);

//Middlewares
app.use(cors());
app.use(express.json());

//DB config
connectDb();

//Routes
app.use("/", authRoutes);

//We use current server to the websocket because we want to run http server and websocket server onto the same port().
server.listen(3002);

//Use the socket instance
// const io = initializeSocket(server);

// io.on("connection", (socket) => {
//   socket.on("createGame", (data) => {
//     console.log("data", data);
//   });
// });
