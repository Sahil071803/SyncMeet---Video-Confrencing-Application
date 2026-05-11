const express = require('express');
const router = express.Router();

const authController = require("../controllers/auth/authController");
const Joi = require("joi");
const validator = require("express-joi-validation").createValidator({});
const auth = require("../middleware/auth"); 

// Register Schema
const registerSchema = Joi.object({
    username: Joi.string().min(3).max(12).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(12).required(),
});

// Login Schema
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(12).required(),
});

// Routes
router.post(
    '/register',
    validator.body(registerSchema),
    authController.Controllers.postRegister
);

router.post(
    "/login",
    validator.body(loginSchema),
    authController.Controllers.postLogin
);

// Protected test route
router.get("/test", auth, (req, res) => {
    res.send('Request passed. User authenticated ✅');
});

module.exports = router;