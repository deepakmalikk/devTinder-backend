const socket =require("socket.io");
const cryto = require("crypto");

const getSecretRoomId = (userId, targetUserId) => {

  return cryto.createHash('sha256').update([userId,targetUserId].sort().join("_")).digest('hex');
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "https://devtinder-0cnr.onrender.com"
    }
  });

  io.on("connection", (socket) => {
  
    
    socket.on("joinChat",([userId, targetUserId])=>{
        const roomId = getSecretRoomId(userId, targetUserId);

        socket.join(roomId);
        console.log(`User ${userId} joined room ${roomId}`);
    });

    socket.io("sendMessage", (firstName, userId, targetUserId, message)=>{
        const roomId = getSecretRoomId(userId,targetUserId)
        io.to(roomId).emit(" ", { firstName, message });
        console.log(`Message from ${firstName}: ${message}`);
    });


  
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
};

module.exports = { initializeSocket };