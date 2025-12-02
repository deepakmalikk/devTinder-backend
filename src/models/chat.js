const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const chatSchema = new mongoose.Schema({
  participants: [ 
    // it will be array as particaipant cann't be one.
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
  ],
  // we are adding one schema inside another schema.
  messages: [messageSchema],
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = { Chat };