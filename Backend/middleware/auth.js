const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    try {
        // 1️⃣ Get Authorization header
        const authHeader = req.headers.authorization;

        // 2️⃣ Check if header exists
        if (!authHeader) {
            return res.status(403).json({
                success: false,
                message: "Authorization header missing"
            });
        }

        // 3️⃣ Check correct format: Bearer <token>
        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Invalid token format"
            });
        }

        // 4️⃣ Extract token
        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token missing"
            });
        }

        // 5️⃣ Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 6️⃣ Attach user to request
        req.user = decoded;

        next();

    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Token expired"
            });
        }

        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }
};

module.exports = verifyToken;