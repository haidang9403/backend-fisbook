const express = require("express");
const authorRouter = express.Router();
const authorController = require("../controllers/author.controller");
const { verifyAccessTokenAndAdmin, verifyAccessTokenAndAuth } = require("../utils/jwt.util");

authorRouter.route("/author")
    .get(authorController.getAll)
    .post(verifyAccessTokenAndAdmin, authorController.add)

authorRouter.route("/author/:id")
    .put(verifyAccessTokenAndAdmin, authorController.update)



module.exports = authorRouter;