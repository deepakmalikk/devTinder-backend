const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/database");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat"); 

const app = express();
const http = require("http");
const initializeSocket = require("./utils/socket");

const server = http.createServer(app);

// ---------- CORS ----------
const allowedOrigins = [
  "http://localhost:5173",               // local dev
  "https://devtinder-0cnr.onrender.com", // deployed frontendx
];

initializeSocket(server);

app.use(
  cors({
  origin: allowedOrigins,
    credentials: true,
  })
);

// ---------- Middleware ----------
app.use(express.json());
app.use(cookieParser());

// ---------- Routes ----------
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);

 

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// ---------- DB + Server start ----------
const PORT = process.env.PORT || 7777;

connectDB()
  .then(() => {
    console.log("✅ Connected to MongoDB");
    server.listen(PORT, () => {
      console.log(" Server listening on port: " + PORT);
    });
  })
  .catch((err) => {
    console.error("❌ Not able to connect to MongoDB");
    console.error(err.message);
    process.exit(1);
  });

module.exports = app;
