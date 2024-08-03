const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    validate: {
      validator: (v) => {
        const emailRegex =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return emailRegex.test(v);
      },
      message: (prop) => `${prop.value} is not a valid email.`,
    },
    unique: true,
  },
  firstName: { type: String, required: [true, "First Name is required!"] },
  lastName: { type: String, required: [true, "Last Name is required!"] },
  password: { type: String, required: [true, "Password is required!"] },
  phone: { type: String }, //Optional
  photo: { type: String }, //Optional
  isVerified: { type: Boolean, default: false },
  games: [{ type: mongoose.Schema.Types.ObjectId, ref: "Game" }],
});

//Also can check validate like this
// userSchema.path("email").validate();

const User = mongoose.model("Users", userSchema);

module.exports = User;
