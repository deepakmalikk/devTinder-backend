const crypto = require("crypto");
const socket = require("socket.io");
const { Chat } = require("../models/chat");

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("$"))
    .digest("hex");
};

const allowedOrigins = [
    "http://localhost:5173",
    "https://devtinder-0cnr.onrender.com",
  ];

const initializeSocket = (server) =>{
  const io = socket(server, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });


  io.on("connection", (socket)=>{
    socket.on("joinChat", ({firstName, userId, targetUserId})=>{
      const roomId = getSecretRoomId(userId, targetUserId);

      console.log(firstName + " joined Room : " + roomId);
      socket.join(roomId);
    });
    socket.on("sendMessage", async ({firstName, userId, targetUserId, text})=>{
      

      //save message to the database.
      try {
        const roomId = getSecretRoomId(userId, targetUserId);
        console.log(`💬 ${firstName} sent message in room ${roomId}: ${text}`);
        // There are two possibilietes either i'm sending 
        // first message totally fresh conversation.
        // Or i'm seconding message to exisiting chat and append new message to it.
        
      let chat = await Chat.findOne({
        participants: { $all: [userId, targetUserId] },
      });

      if (!chat) {
        chat = new Chat({
          participants:[userId, targetUserId],
          messages:[]
        });
      }
        chat.messages.push({
          senderId: userId,
          text,
        })
        await chat.save();
        io.to(roomId).emit("messageRecieved", {firstName, text});

      
      } catch (error) {
        console.log(error);
      }

      
    });
    socket.on("disconnect", ()=>{});
  })
};

module.exports = initializeSocket;