import { Server, Socket } from "socket.io";
import { createServer } from "http";
import express from "express";

const socketApp = express();
const server = createServer(socketApp);
server.listen(3000);
export const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins
    methods: ["GET", "POST"],
  },
});

io.on("connection", (client) => {
  console.log("client-id", client.id);

  client.on("chat message", (msg) => {
    console.log(msg);

    // Broadcast the message to all connected clients
    io.emit("chat message", msg);
  });
});

export const sendValue = (data) => {
  io.emit("data", data);
};

export const sendValueTemp = (data) => {
  io.emit("temp", data);
};
