const User = require('../../models/user');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // ✅ Added

const postRegister = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // check if user exists
        const userExists = await User.exists({ email });

        if (userExists) {
            return res.status(409).send("E-mail already in use.");
        }

        // encrypt password
        const encryptedPassword = await bcrypt.hash(password, 10);

        // create user document and save in database
        const user = await User.create({
            username,
            email: email.toLowerCase(),
            password: encryptedPassword,
        });

        // create JWT Token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.status(201).json({
            token,
            userDetails: {
                _id: user._id,
                email: user.email,
                username: user.username,
            },
        });

    } catch (err) {
        console.log(err);
        return res.status(500).send("Error occurred. Please try again");
    }
};

module.exports = postRegister;