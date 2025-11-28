const socket =require("socket.io");


const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173"
    }
  });

  io.on("connection", (socket) => {
  
    
    socket.on("joinChat",([userId, targetUserId])=>{
        const roomId = [userId,targetUserId].sort().join("_");

        socket.join(roomId);
        console.log(`User ${userId} joined room ${roomId}`);
    });

    socket.io("sendMessage", (firstName, userId, targetUserId, message)=>{
        const roomId = [userId, targetUserId].sort().join("_");
        io.to(roomId).emit("receiveMessage", { firstName, message });
        console.log(`Message from ${firstName}: ${message}`);
    });


  
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
};

module.exports = { initializeSocket };