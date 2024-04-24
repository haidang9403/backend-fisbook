const express = require("express");
const categoryRouter = express.Router();
const categoryController = require("../controllers/category.controller")
const { verifyAccessTokenAndAdmin } = require("../utils/jwt.util")


categoryRouter.route("/category")
    .get(categoryController.getAll)
    .post(verifyAccessTokenAndAdmin, categoryController.add)

categoryRouter.route("/category/:id")
    .put(verifyAccessTokenAndAdmin, categoryController.update)

module.exports = categoryRouter;