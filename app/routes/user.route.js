const express = require("express");
const UserController = require("../controllers/user.controller");
const upload = require("../utils/upload_img.util");
const { verifyAccessTokenAndAuthOrAdmin, verifyAccessTokenAndAuth, verifyAccessTokenAndAdmin, verifyRefreshTokenAndAdmin } = require("../utils/jwt.util");

const userRoute = express.Router();

userRoute.get("/user", verifyAccessTokenAndAdmin, UserController.getAll);

userRoute.get("/user/:id", verifyAccessTokenAndAuthOrAdmin, UserController.getDetailUser);

userRoute.post("/user/:id", verifyAccessTokenAndAuthOrAdmin, UserController.update);
userRoute.post("/user/full/:id", verifyAccessTokenAndAuthOrAdmin, UserController.updateFull);

userRoute.post("/user/image/:id", verifyAccessTokenAndAuth, upload.single('photo'), UserController.updateImage);

module.exports = userRoute;

