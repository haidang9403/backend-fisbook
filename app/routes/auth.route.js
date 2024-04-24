const express = require("express");
const authController = require("../controllers/auth.controller");
const { verifyAccessTokenAndAuth, verifyRefreshToken, verifyAccessTokenAndAdmin, verifyRefreshTokenAndAdmin } = require("../utils/jwt.util");

const authRoute = express.Router();

// User
authRoute.post("/register", authController.register);

authRoute.post("/login", authController.login);

authRoute.post("/refresh-token", authController.refreshToken);

authRoute.post("/logout", verifyRefreshToken, authController.logout);

authRoute.post("/change-password/:id", verifyAccessTokenAndAuth, authController.changePassword)

// Admin
authRoute.post("/admin/login", authController.adminLogin);

authRoute.post("/admin/register", verifyAccessTokenAndAdmin, authController.adminRegister);

authRoute.post("/admin/refresh-token", authController.refreshTokenAdmin);

authRoute.post("/admin/logout", verifyRefreshTokenAndAdmin, authController.adminLogout);

authRoute.get("/admin/get-token", authController.getRefeshToken);
authRoute.get("/get-token", authController.getRefreshTokenUser);

module.exports = authRoute;