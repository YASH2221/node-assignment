// socketTest.js
const { io } = require("socket.io-client");

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.Q-YlBwgoquiNXGMIfeAhP0ct9_MABSIFysIbbFjz98s"; // Replace this with a valid JWT token

const socket = io("http://localhost:8500", {
  auth: { token }, // Authenticate with the JWT token
});

socket.on("connect", () => {
  console.log("Connected to WebSocket server");

  // Join a chat room
  socket.emit("joinRoom", "room1");

  // Send a message to the room
  socket.emit("sendMessage", "Hello, Room 1!", "room1");
});

socket.on("message", (data) => {
  console.log("Message received:", data);
});

socket.on("connect_error", (err) => {
  console.error("Connection error:", err.message);
});

socket.on("disconnect", () => {
  console.log("Disconnected from WebSocket server");
});
