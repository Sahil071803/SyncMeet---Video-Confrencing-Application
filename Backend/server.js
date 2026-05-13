require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");

// =============================================
// ROUTES
// =============================================

const authRoutes = require("./routes/authRoutes");
const friendInvitationRoutes = require("./routes/friendInvitationRoutes");
const messageRoutes = require("./routes/messageRoutes");

// =============================================
// SOCKET SERVER
// =============================================

const initSocketServer = require("./SocketServer");

// =============================================
// APP
// =============================================

const app = express();
const server = http.createServer(app);

const PORT = process.env.API_PORT || 5002;
const HOST = "0.0.0.0";

// =============================================
// MIDDLEWARE
// =============================================

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =============================================
// HEALTH CHECK
// =============================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Video Conferencing Backend Running",
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "✅ API is healthy",
  });
});

// =============================================
// API ROUTES
// =============================================

app.use("/api/auth", authRoutes);

app.use(
  "/api/friend-invitation",
  friendInvitationRoutes
);

app.use("/api/messages", messageRoutes);

// =============================================
// 404 HANDLER
// =============================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "❌ Route not found",
  });
});

// =============================================
// GLOBAL ERROR HANDLER
// =============================================

app.use((err, req, res, next) => {
  console.log("❌ Global Server Error:", err);

  res.status(err?.status || 500).json({
    success: false,
    message: err?.message || "Internal server error",
  });
});

// =============================================
// SOCKET INITIALIZATION
// =============================================

initSocketServer(server);

// =============================================
// DATABASE CONNECTION + SERVER START
// =============================================

const startServer = async () => {
  try {
    console.log("📦 Connecting MongoDB...");

    await mongoose.connect(process.env.MONGO_URL);

    console.log("✅ MongoDB Connected");

    server.listen(PORT, HOST, () => {
      console.log("\n🚀 Server running successfully");
      console.log(`🌐 Local:   http://localhost:${PORT}`);
      console.log(`📱 Mobile:  http://10.125.246.112:${PORT}\n`);
    });
  } catch (err) {
    console.log("❌ MongoDB Connection Error:", err);
    process.exit(1);
  }
};

startServer();

// =============================================
// PROCESS ERROR HANDLERS
// =============================================

process.on("unhandledRejection", (err) => {
  console.log("❌ Unhandled Rejection:", err);
});

process.on("uncaughtException", (err) => {
  console.log("❌ Uncaught Exception:", err);
});