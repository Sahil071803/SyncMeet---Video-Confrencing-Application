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
    emailProvider: process.env.SENDGRID_API_KEY ? "sendgrid" : (process.env.EMAIL_USER ? "gmail" : "none"),
    hasFrontendUrl: !!process.env.FRONTEND_URL,
    nodeEnv: process.env.NODE_ENV,
  });
});

// Debug: test SMTP connectivity from Render
const net = require("net");
app.get("/api/test-email", async (req, res) => {
  const hosts = [
    { name: "smtp.gmail.com:465", host: "smtp.gmail.com", port: 465 },
    { name: "smtp.gmail.com:587", host: "smtp.gmail.com", port: 587 },
    { name: "smtp.sendgrid.net:587", host: "smtp.sendgrid.net", port: 587 },
    { name: "smtp.sendgrid.net:2525", host: "smtp.sendgrid.net", port: 2525 },
    { name: "smtp.mailgun.org:587", host: "smtp.mailgun.org", port: 587 },
    { name: "smtp.mailgun.org:2525", host: "smtp.mailgun.org", port: 2525 },
    { name: "email-smtp.us-east-1.amazonaws.com:587", host: "email-smtp.us-east-1.amazonaws.com", port: 587 },
    { name: "email-smtp.us-east-1.amazonaws.com:2587", host: "email-smtp.us-east-1.amazonaws.com", port: 2587 },
  ];
  const results = await Promise.all(hosts.map(async (h) => {
    try {
      await new Promise((resolve, reject) => {
        const s = net.createConnection(h.port, h.host, () => { s.end(); resolve(); });
        s.on("error", reject);
        s.setTimeout(8000, () => { s.destroy(); reject(new Error("timeout")); });
      });
      return { host: h.name, reachable: true };
    } catch (e) {
      return { host: h.name, reachable: false, error: e.message };
    }
  }));
  res.json({ results });
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
    if (!process.env.SENDGRID_API_KEY && (!process.env.EMAIL_USER || !process.env.EMAIL_PASS)) {
      console.log("⚠️  No email provider configured — invitation emails will fail");
      console.log("   ➜ Recommended: Add SENDGRID_API_KEY in Render Dashboard → Environment Variables");
      console.log("   ➜ Alternative: Add EMAIL_USER + EMAIL_PASS (Gmail App Password)");
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