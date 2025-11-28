const socket = require("socket.io");
const crypto = require("crypto");

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: [
        "http://localhost:5173",                // local dev
        "https://devtinder-0cnr.onrender.com",  // deployed frontend
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("joinChat", ([userId, targetUserId]) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      socket.join(roomId);
      console.log(`User ${userId} joined room ${roomId}`);
    });

    socket.on("sendMessage", ({ firstName, userId, targetUserId, message }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      io.to(roomId).emit("newMessage", { firstName, message, userId, targetUserId });
      console.log(`Message from ${firstName}: ${message}`);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected:", socket.id);
    });
  });
};

module.exports = { initializeSocket };
