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

    socket.on("sendMessage", async({ firstName, userId, targetUserId, message }) => {
      try {
         const roomId = getSecretRoomId(userId, targetUserId);
         let chat = await Chat.findOne({
        participants: { $all: [userId, targetUserId]},
      })

      if(!chat){
        chat = new Chat({
          participants: [userId, targetUserId],
          messages: [],
        })
      }
      chat.message.push({
        senderId:  userId,
        message,
      })
        await chat.save();
         io.to(roomId).emit("newMessage", { firstName, message, userId, targetUserId });
         console.log(`Message from ${firstName}: ${message}`);

      } catch (error) {
        console.error("Error saving message:", error);
      }
     
    });

    socket.on("disconnect", () => {
      console.log("user disconnected:", socket.id);
    });
  });
};

module.exports = { initializeSocket };
