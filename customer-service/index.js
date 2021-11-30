const express = require("express");
const app = express();
const PORT = 3000;
const mongoose = require("mongoose");
const User = require("./User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

mongoose.connect(
  "mongodb://localhost:27017/customer-service",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log(`Customer-Service DB Connected`);
  }
);

app.use(express.json());

app.post("/customer/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ msg: "Please enter all fields" });
  }

  User.findOne({ email }).then((user) => {
    if (!user) return res.status(400).json({ msg: "User does not exist" });

    // Validate password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });
      const payload = {
        email,
        username: user.username,
      };
      jwt.sign(payload, "secret", (err, token) => {
        if (err) console.log(err);
        else
          return res.json({
            success: true,
            status: "Login Successful!",
            token: token,
            userID: user._id
          });
      });
    });
  });
});

app.post("/customer/register", async (req, res) => {
  const { email, password, username } = req.body;

  if (!username || !email || !password) {
    res.status(400).json({ msg: "Please enter all fields" });
  }

  User.findOne({ email }).then((user) => {
    if (user) return res.status(400).json({ msg: "User already exists" });

    const newUser = new User({ email, username, password });

    // Create salt and hash
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser.save();
        return res.json(newUser);
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Customer-Service is running at port ${PORT}`);
});

module.exports = app;
