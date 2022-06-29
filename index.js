const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", "./public");

// Router
app.get("/", (req, res) => {
    res.render("login",{userNames});
});
app.get("/index", (req, res) => {
    res.render("index");
});
let messages = [];
let userNames = [];

// Socket
io.on("connection", (socket) => {
    console.log(socket.id);
  socket.emit("messages", messages);
  socket.emit("userNames", userNames);
  socket.on("message", (msg) => {
    messages.push(msg);
    io.emit("message", msg);
  });
  socket.on("userName", (msg) => {
    userNames.push(msg);
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
