const mongoose = require("mongoose");

const connectDB = async()=>await mongoose.connect("mongodb+srv://deepak:malik@namastenodejs.5lhz4xb.mongodb.net/MyAPP");

module.exports = connectDB;