const express = require("express");
const User = require("./models/user");
const app = express();
const connectDB = require("./config/database")
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(cors({
    credentials:true,
    origin:"http://localhost:5173"
}))
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");



app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);




connectDB()
.then(()=>{
    console.log("Connected to MongoDB");
    app.listen(3000,()=>{
    console.log("listening port 3000");
  })
})
.catch((err)=>{
    console.log("not able to connect");
})

