const mongoose = require("mongoose");
const dotenv = require("dotenv");

//config env
dotenv.config();

//Mongo URI
const URI = process.env.DB_URI;

const connectDb = () => {
  mongoose
    .connect(URI)
    .then(() => {
      console.log(`DB Connected!`);
    })
    .catch((err) => {
      console.log(err);
    });
};

mongoose.connection.on("disconnected", () => {
  console.log("mongoose connection is disconnected");
});

process.on("SIGINT", () => {
  mongoose.connection.close(() => {
    console.log("mongoose close");
    process.exit(0);
  });
});

module.exports = { connectDb };
