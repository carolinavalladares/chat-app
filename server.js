const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const PORT = 3000;

let users = [];

// Serve files
app.use(express.static("./public"));

// Socket

io.on("connection", (socket) => {
  console.log("new user");

  // New user joined
  socket.on("join-server", (name) => {
    const newUser = { username: name, id: socket.id };
    users.push(newUser);

    // Send user joined to other users
    socket.broadcast.emit("user-joined", name);

    // Emit event to everyone to update users list
    io.emit("new-user", users);
  });

  // receive message from client
  socket.on("send-message", (msg) => {
    // Get user
    const user = users.filter((item) => item.id === socket.id)[0];

    // Send message to others
    socket.broadcast.emit("message-sent", {
      message: msg,
      user: user.username,
    });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");

    // Send user disconnect
    const user = users.filter((item) => item.id === socket.id);
    console.log(user[0]);

    socket.broadcast.emit("user-disconnected", user[0]);

    // Filter disconnected user out of the array
    users = users.filter((item) => item.id !== socket.id);

    // Emit event to update users again
    io.emit("new-user", users);
  });
});

// initialize server
server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
