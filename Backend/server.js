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

// =============================================
// ENVIRONMENT VARIABLES
// =============================================

const PORT = process.env.PORT || 5002;

const CLIENT_URL =
  process.env.CLIENT_URL || "*";

// =============================================
// MIDDLEWARE
// =============================================

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "PATCH",
      "OPTIONS",
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// =============================================
// HEALTH CHECK
// =============================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message:
      "🚀 SyncMeet Backend Running Successfully",
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
  console.error(
    "❌ Global Server Error:",
    err
  );

  res.status(err?.status || 500).json({
    success: false,
    message:
      err?.message ||
      "Internal server error",
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

    await mongoose.connect(
      process.env.MONGO_URL
    );

    console.log(
      "✅ MongoDB Connected Successfully"
    );

    server.listen(PORT, () => {
      console.log(
        `🚀 Server running on port ${PORT}`
      );

      console.log(
        `🌍 Environment: ${
          process.env.NODE_ENV ||
          "development"
        }`
      );
    });
  } catch (err) {
    console.error(
      "❌ MongoDB Connection Error:",
      err
    );

    process.exit(1);
  }
};

startServer();

// =============================================
// PROCESS ERROR HANDLERS
// =============================================

process.on(
  "unhandledRejection",
  (err) => {
    console.error(
      "❌ Unhandled Rejection:",
      err
    );

    server.close(() => {
      process.exit(1);
    });
  }
);

process.on(
  "uncaughtException",
  (err) => {
    console.error(
      "❌ Uncaught Exception:",
      err
    );

    process.exit(1);
  }
);