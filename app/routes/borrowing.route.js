const express = require("express");
const borrowingRouter = express.Router();
const borrowingController = require("../controllers/borrowing.controller");
const JWT = require("../utils/jwt.util");

borrowingRouter.route("/borrow")
    .get(JWT.verifyAccessTokenAndAdmin, borrowingController.getAll)
    .post(JWT.verifyAccessToken, borrowingController.add)

borrowingRouter.route("/borrow/:id")
    .get(JWT.verifyAccessTokenAndAuthOrAdmin, borrowingController.get)
    .put(JWT.verifyAccessTokenAndAdmin, borrowingController.update)

module.exports = borrowingRouter;