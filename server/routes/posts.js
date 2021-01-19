const verifyToken = require("./verifyToken");

const route = require("express").Router();
const verify = require("./verifyToken");

route.get("/", verify, (req, res) => {
  res.send("Valid Token");
});

module.exports = route;
