const route = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { registerValidation, loginValidation } = require("../validation");

route.post("/register", async (req, res) => {
  // VALIDATE THE DATA
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // CHECK IF USER ALREADY IN DATABASE
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email already exists");

  // HASH PASSWORD
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // CREATE USER
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
  });

  // SAVE USER
  try {
    await user.save();
    res.send({ user: user.id, email: user.email, password: user.password });
  } catch (err) {
    res.status(400).send(err);
    console.log(err);
  }
});

route.post("/login", async (req, res) => {
  // VALIDATE DATA BEFORE WE CHECK FOR USER
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // CHECK IF EMAIL EXISTS
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email does not exist");

  // PASSWORD IS CORRECT
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Invalid Password");

  // CREATE AND ASSIGN TOKEN
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).send(token);
});

module.exports = route;
