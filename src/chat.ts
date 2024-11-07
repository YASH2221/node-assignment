import { Server, Socket } from "socket.io";
import { verifyToken } from "./utils/jwtUtils";



export default function initializeChat(io: Server) {
  // Middleware for authenticating WebSocket connections with JWT
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth.token as string;
    if (!token) {
      return next(new Error("Authentication error: Token not provided"));
    }
 console.log(token)
    verifyToken(token).then((data)=>{
        socket.data.user = data
        next();
    }).catch((err:any)=>{
        return next(new Error("Authentication error: Invalid token"));
    }) 
  });

  // Handle chat events
  io.on("connection", (socket: Socket) => {
    console.log("User connected:", socket.data.user);

    // Join a specific room
    socket.on("joinRoom", (room: string) => {
      socket.join(room);
      console.log(`User ${socket.data.user.id} joined room ${room}`);
    });

    // Send a message to a specific room
    socket.on("sendMessage", (message: string, room: string) => {
      io.to(room).emit("message", { user: socket.data.user, message });
    });

    // Handle user disconnection
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
}
