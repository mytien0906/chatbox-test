const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", "./public");

// Router
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/user/:id", (req, res) => {
  res.render("user", { id: req.params.id });
});

// Socket
const users = [];
const messages = [];

io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    const indexUser = users.findIndex((user) => user.id === socket.id);
    if (indexUser !== -1) {
      users[indexUser].online = false;
      io.emit("users", users);
    }
  });

  socket.on("re-login", (data) => {
    const { username } = data;
    const indexUser = users.findIndex((user) => user.username === username);
    if (indexUser !== -1) {
      users[indexUser].id = socket.id;
      users[indexUser].online = true;
      io.emit("users", users);
      socket.emit("messages", messages);
    } else {
      socket.emit("logout");
    }
  });

  socket.on("login", (data) => {
    const { username, password } = data;
    const indexUser = users.findIndex((user) => user.username === username);
    if (users?.[indexUser]) {
      if (users?.[indexUser].password === password) {
        users[indexUser].id = socket.id;
        users[indexUser].online = true;
        socket.emit("login", { username, success: true });
        io.emit("users", users);
        socket.emit("messages", messages);
      } else {
        socket.emit("login", { success: false, message: "Wrong password." });
      }
    } else {
      socket.emit("login", { success: false, message: "User not found." });
    }
  });

  socket.on("register", (data) => {
    const { username, password } = data;
    const user = users.find((user) => user.username === username);
    if (user) {
      socket.emit("register", {
        success: false,
        message: "Username already exists.",
      });
    } else {
      users.push({ id: socket.id, username, password, online: true });
      socket.emit("register", {
        username,
        success: true,
        message: "Register success.",
      });
      io.emit("users", users);
      socket.emit("messages", messages);
    }
  });

  socket.on("message", (data) => {
    const { username, message } = data;
    const lastMessage = messages[messages.length - 1];
    messages.push({ username, message });

    io.emit("message", {
      username,
      message,
      next: lastMessage?.username === username,
    });
  });
  socket.on("user-detail", (data) => {
    const indexUser = users.findIndex((user) => user.username === data);
    const newUser = users[indexUser];
    if (indexUser !== -1) {
      delete newUser.password;
      socket.emit("user-detail", newUser);
    }
  });
  socket.on("private message",(data)=>{
    const {message,id} = data;
    const indexUser = users.findIndex((user) => user.id === id);
    if(indexUser !== -1){
      io.to(id).emit("private message",{message,username:users[indexUser].username});
    }
  });
});

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
