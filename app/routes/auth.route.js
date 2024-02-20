const express = require("express");
const authController = require("../controllers/auth.controller");
const { verifyAccessToken } = require("../utils/jwt.util");

const authRoute = express.Router();

authRoute.post("/register", authController.register);

authRoute.post("/login", authController.login);

authRoute.post("/refresh-token", authController.refreshToken);

authRoute.post("/logout", verifyAccessToken, authController.logout);

module.exports = authRoute;