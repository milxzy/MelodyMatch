import { Server } from "socket.io";
import Message from "./models/message.js";

// store online users
const onlineUsers = new Map();

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "*",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    console.log(`user connected: ${socket.id}`);

    // user joins with their id
    socket.on("user-online", (userId) => {
      onlineUsers.set(userId, socket.id);
      console.log(`user ${userId} is online with socket ${socket.id}`);

      // broadcast online status to all clients
      io.emit("user-status-change", {
        userId,
        status: "online"
      });
    });

    // handle sending messages
    socket.on("send-message", async (data) => {
      const { sender, recipient, content } = data;

      try {
        // save message to database
        const message = new Message({ sender, recipient, content });
        await message.save();

        // populate sender and recipient details
        await message.populate('sender', 'preferred_name profile_pic');
        await message.populate('recipient', 'preferred_name profile_pic');

        // send to recipient if they're online
        const recipientSocketId = onlineUsers.get(recipient);
        if (recipientSocketId) {
          io.to(recipientSocketId).emit("receive-message", message);
        }

        // send confirmation back to sender
        socket.emit("message-sent", message);
      } catch (error) {
        console.error("error sending message:", error);
        socket.emit("message-error", { error: "failed to send message" });
      }
    });

    // handle typing indicators
    socket.on("typing-start", (data) => {
      const { userId, recipientId } = data;
      const recipientSocketId = onlineUsers.get(recipientId);

      if (recipientSocketId) {
        io.to(recipientSocketId).emit("user-typing", { userId });
      }
    });

    socket.on("typing-stop", (data) => {
      const { userId, recipientId } = data;
      const recipientSocketId = onlineUsers.get(recipientId);

      if (recipientSocketId) {
        io.to(recipientSocketId).emit("user-stopped-typing", { userId });
      }
    });

    // handle disconnect
    socket.on("disconnect", () => {
      console.log(`user disconnected: ${socket.id}`);

      // find and remove user from online users
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);

          // broadcast offline status
          io.emit("user-status-change", {
            userId,
            status: "offline"
          });

          break;
        }
      }
    });
  });

  return io;
};

export const getOnlineUsers = () => {
  return Array.from(onlineUsers.keys());
};
