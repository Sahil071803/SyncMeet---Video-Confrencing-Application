require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");
const friendInvitationRoutes = require("./routes/friendInvitationRoutes");
const messageRoutes = require("./routes/messageRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

const initSocketServer = require("./SocketServer");

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5002;

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://sync-meet-video-confrencing-applica.vercel.app",
];

if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

const corsOptions = {
  origin: process.env.NODE_ENV === "production"
    ? (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        console.log("❌ Blocked by CORS:", origin);
        return callback(new Error(`CORS not allowed for origin: ${origin}`));
      }
    : true,

  credentials: true,

  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],

  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(express.json({ limit: "10mb" }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 SyncMeet Backend Running Successfully",
    environment: process.env.NODE_ENV || "development",
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "✅ API is healthy",
    allowedOrigins,
    emailProvider: process.env.RESEND_API_KEY ? "resend" : "none",
    hasFrontendUrl: !!process.env.FRONTEND_URL,
    nodeEnv: process.env.NODE_ENV,
  });
});

// Debug: test email delivery via Resend
app.get("/api/test-email", async (req, res) => {
  const { Resend } = require("resend");
  const key = (process.env.RESEND_API_KEY || "").trim();
  if (!key) return res.json({ status: "Set RESEND_API_KEY in Render Dashboard → Environment" });
  try {
    const resend = new Resend(key);
    const { data, error } = await resend.emails.send({
      from: "SyncMeet <onboarding@resend.dev>",
      to: "sahilatram1226@gmail.com",
      subject: "SyncMeet Test",
      html: "<p>Resend works from Render!</p>",
    });
    if (error) throw new Error(error.message);
    res.json({ sent: true, id: data?.id });
  } catch (e) {
    res.json({ sent: false, error: e.message });
  }
});

app.use("/api/auth", authRoutes);

app.use("/api/friend-invitation", friendInvitationRoutes);

app.use("/api/messages", messageRoutes);

app.use("/api/upload", uploadRoutes);

// Serve static files from uploads directory
app.use("/uploads", express.static("uploads"));

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "❌ Route not found",
    path: req.originalUrl,
  });
});

app.use((err, req, res, next) => {
  console.error("❌ Global Server Error:", err.message);

  res.status(err?.status || 500).json({
    success: false,
    message: err?.message || "Internal server error",
  });
});

initSocketServer(server);

const startServer = async () => {
  try {
    if (!process.env.MONGO_URL) {
      throw new Error("MONGO_URL missing in .env");
    }

    console.log("📦 Connecting MongoDB...");

    await mongoose.connect(process.env.MONGO_URL);

    console.log("✅ MongoDB Connected Successfully");

    // Warn about missing email config
    if (!process.env.RESEND_API_KEY) {
      console.log("⚠️  RESEND_API_KEY not set — invitation emails will fail");
      console.log("   ➜ Add RESEND_API_KEY in Render Dashboard → Environment Variables");
    }

    if (!process.env.FRONTEND_URL) {
      console.log("⚠️  FRONTEND_URL not set — invite links may point to localhost");
      console.log("   ➜ Add FRONTEND_URL in Render Dashboard → Environment Variables");
    }

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log("✅ Allowed Origins:", allowedOrigins);
    });
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  }
};

startServer();

process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);

  server.close(() => {
    process.exit(1);
  });
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  process.exit(1);
});