const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const mongoose = require("mongoose");
require("dotenv").config();

io.on("connection", (socket) => {
  console.log(socket.id, "connected");
});

// Routes
const authRoute = require("./routes/auth");
const postsRoute = require("./routes/posts");

// Connect to Database
mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Database Connected");
  }
);

// Middleware
app.use(express.json());
// Route MiddleWare
app.use("/api/user", authRoute);
app.use("/posts", postsRoute);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

http.listen(3000, () => {
  console.log("Server is running");
});
