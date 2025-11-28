const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/database");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

const app = express();
const http = require("http");
const { initializeSocket } = require("./utils/socket");

const server = http.createServer(app);

// ---------- CORS ----------
const allowedOrigins = [
  "http://localhost:5173",               // local dev
  "https://devtinder-0cnr.onrender.com", // deployed frontend
];

initializeSocket(server);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS: " + origin));
    },
    credentials: true,
  })
);

// ---------- Middleware ----------
app.use(express.json());
app.use(cookieParser());

// ---------- Routes ----------
app.use("/api", authRouter);
app.use("/api", profileRouter);
app.use("/api", requestRouter);
app.use("/api", userRouter);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// ---------- DB + Server start ----------
const PORT = process.env.PORT || 7777;

connectDB()
  .then(() => {
    console.log("✅ Connected to MongoDB");
    server.listen(PORT, () => {
      console.log("🚀 Server listening on port: " + PORT);
    });
  })
  .catch((err) => {
    console.error("❌ Not able to connect to MongoDB");
    console.error(err.message);
    process.exit(1);
  });

module.exports = app;
