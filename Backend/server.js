require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");

// =============================
// ROUTES
// =============================
const authRoutes = require("./routes/authRoutes");
const friendInvitationRoutes = require(
  "./routes/friendInvitationRoutes"
);
const messageRoutes = require("./routes/messageRoutes");

// =============================
// SOCKET SERVER
// =============================
const initSocketServer = require("./SocketServer");

// =============================
// APP SETUP
// =============================
const app = express();

const server = http.createServer(app);

const PORT = process.env.API_PORT || 5002;

// =============================
// MIDDLEWARE
// =============================
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// =============================
// HEALTH CHECK ROUTE
// =============================
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is running 🚀",
  });
});

// =============================
// API ROUTES
// =============================
app.use("/api/auth", authRoutes);

app.use(
  "/api/friend-invitation",
  friendInvitationRoutes
);

app.use("/api/messages", messageRoutes);

// =============================
// 404 HANDLER
// =============================
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "API route not found",
  });
});

// =============================
// GLOBAL ERROR HANDLER
// =============================
app.use((err, req, res, next) => {
  console.log("❌ Global Server Error:", err);

  res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
});

// =============================
// SOCKET INITIALIZATION
// =============================
initSocketServer(server);

// =============================
// DATABASE CONNECTION
// =============================
console.log(
  "📦 Mongo URL:",
  process.env.MONGO_URL
);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("✅ MongoDB connected");

    server.listen(PORT, () => {
      console.log(
        `🚀 Server running on http://localhost:${PORT}`
      );
    });
  })
  .catch((err) => {
    console.log(
      "❌ MongoDB connection error:",
      err
    );
  });

// =============================
// UNHANDLED PROMISE REJECTION
// =============================
process.on("unhandledRejection", (err) => {
  console.log(
    "❌ Unhandled Rejection:",
    err
  );
});

// =============================
// UNCAUGHT EXCEPTION
// =============================
process.on("uncaughtException", (err) => {
  console.log(
    "❌ Uncaught Exception:",
    err
  );
});