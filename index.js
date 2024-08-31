// "This is the delegate backend server to use it like to do other tasks to make primary next js backend fast"

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { initializeSocket } = require("./socket");
const { authRoutes } = require("./src/routes/authRoutes");
const { connectDb } = require("./src/config/dbConfig");
const { sendMail } = require("./src/utils/sendEmail");
const client = require("./src/config/redisConfig");
const { profileRoutes } = require("./src/routes/profileRoutes");
const cookieParser = require("cookie-parser");
// const { receiveMessageFromQueue } = require("./src/utils/queue");

dotenv.config();

//express app
const app = express();

//Add current app
const server = http.createServer(app);

//Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());

//DB config
connectDb();

//Routes
app.use("/", authRoutes);
app.use("/api/profile", profileRoutes);
//Profile APIS

//SUBSCRIBE EXAMPLE from messageQueue example
// client.subscribe("messageQueue", (message, channel) => {
//   console.log(`Received message: "${message}" from channel: "${channel}"`);
// });

// Subscribe to the email send  channel
// client.subscribe("gameEmailQueue", async (message, channel) => {
//   if (message) {
//     try {
//       await sendMail(JSON.parse(message));
//     } catch (error) {
//       console.error(
//         "Error retrieving or processing message from queue:",
//         error
//       );
//     }
//   }
// });

//amqb try
// const receiveMessageFromRabbitMQ = async () => {
//   //This is infinite loop because queues are always active for taking the task
//   // while (true) {
//   try {
//     amqp.connect(url, function (err, connection) {
//       if (err) {
//         throw new Error(err);
//       }
//       connection.createChannel(function (err1, channel) {
//         if (err1) {
//           throw new Error(err1);
//         }
//         // Note that we declare the queue here, as well. Because we might start the consumer before the publisher, we want to make sure the queue exists before we try to consume messages from it.
//         channel.assertQueue(queue, {
//           durable: true,
//         });

//         channel.consume(
//           queue,
//           function (msg) {
//             console.log("msgggggggggggggg", msg.content.toString());
//           },
//           {
//             noAck: true,
//           }
//         );
//       });
//     });
//   } catch (err) {
//     console.error("Error retrieving or processing message from queue:", err);
//   }
// };

// receiveMessageFromRabbitMQ();
// };

// app.get("/messageQueue", receiveMessageFromRabbitMQ);

// Function to process the message queue
const sendEmailProcessQueue = async () => {
  //This is infinite loop because queues are always active for taking the task
  while (true) {
    try {
      const res = await client.brPop("gameEmailQueue", 0);
      if (res?.element) {
        await sendMail(JSON.parse(res?.element));
      } else {
        console.log("No message received from queue.");
      }
    } catch (err) {
      console.error("Error retrieving or processing message from queue:", err);
    }
  }
};

// const queueMessage = () => {
//   receiveMessageFromQueue("gameEmailQueue", async (msg) => {
//     try {
//       if (msg) {
//         await sendMail(JSON.parse(msg?.content?.toString()));
//       } else {
//         console.log("No message received from queue.");
//       }
//     } catch (error) {
//       console.error("Error retrieving or processing message from queue:", err);
//     }
//   });
// };

//We use current server to the websocket because we want to run http server and websocket server onto the same port().
server.listen(3002, () => {
  //Make connection with redis when server is online
  client.connect().then(() => {
    console.log("connected to redis!");
    //WITH RABBIT MQ
    // queueMessage();
    sendEmailProcessQueue();
  });
});

//Use the socket instance
// const io = initializeSocket(server);

// io.on("connection", (socket) => {
//   socket.on("createGame", (data) => {
//     console.log("data", data);
//   });
// });
