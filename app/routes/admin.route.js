const express = require("express");
const AdminController = require("../controllers/admin.controller");
const { verifyAccessToken, verifyAccessTokenAndAdmin, verifyRefreshTokenAndAdmin, verifyAccessTokenAndAuth } = require("../utils/jwt.util");

const adminRoute = express.Router();

adminRoute.get("/admin", verifyAccessTokenAndAdmin, AdminController.getAll);

adminRoute.get("/admin/:id", verifyAccessTokenAndAuth, AdminController.getDetails)

module.exports = adminRoute;

