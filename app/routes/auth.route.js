const express = require("express");
const authController = require("../controllers/auth.controller");
const { verifyAccessToken, verifyAccessTokenAndAdmin } = require("../utils/jwt.util");

const authRoute = express.Router();

// User
authRoute.post("/register", authController.register);

authRoute.post("/login", authController.login);

authRoute.post("/refresh-token", authController.refreshToken);

authRoute.post("/logout", verifyAccessToken, authController.logout);

// Admin
authRoute.post("/admin/login", authController.adminLogin);

authRoute.post("/admin/register", verifyAccessTokenAndAdmin, authController.adminRegister);

authRoute.post("/admin/refresh-token", authController.refreshTokenAdmin);

authRoute.post("/admin/logout", verifyAccessTokenAndAdmin, authController.adminLogout);

module.exports = authRoute;