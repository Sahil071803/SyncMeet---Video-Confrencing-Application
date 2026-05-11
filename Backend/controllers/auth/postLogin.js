const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const postLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // =========================
        // FIND USER
        // =========================
        const user = await User.findOne({
            email: email.toLowerCase(),
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid credentials. Please try again",
            });
        }

        // =========================
        // CHECK PASSWORD
        // =========================
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid credentials. Please try again",
            });
        }

        // =========================
        // GENERATE TOKEN
        // =========================
        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
            },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        // =========================
        // SEND RESPONSE (FIXED)
        // =========================
        return res.status(200).json({
            token,
            userDetails: {
                _id: user._id,
                email: user.email,
                username: user.username,
            },
        });

    } catch (err) {
        console.log("LOGIN ERROR:", err);

        return res.status(500).json({
            message: "Something went wrong. Please try again",
        });
    }
};

module.exports = postLogin;