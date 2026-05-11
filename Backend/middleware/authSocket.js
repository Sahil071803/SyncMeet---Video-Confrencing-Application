const jwt = require("jsonwebtoken");

const authSocket = (socket, next) => {
  const token = socket.handshake.auth?.token;

  if (!token) {
    return next(new Error("NOT_AUTHORIZED"));
  }

  if (!process.env.JWT_SECRET) {
    console.log("JWT_SECRET missing");
    return next(new Error("SERVER_CONFIGURATION_ERROR"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 NORMALIZE USER ID (IMPORTANT FIX)
    socket.user = {
      userId: decoded.userId || decoded._id || decoded.id,
      email: decoded.email,
    };

    console.log("🔐 Socket authenticated:", socket.user);

    next();
  } catch (err) {
    console.log("❌ Socket auth error:", err.message);
    return next(new Error("NOT_AUTHORIZED"));
  }
};

module.exports = authSocket;