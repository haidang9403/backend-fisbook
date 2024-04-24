const express = require("express");
const publisherRouter = express.Router();
const publisherController = require("../controllers/publisher.controller");
const { verifyAccessTokenAndAdmin } = require("../utils/jwt.util")

publisherRouter.route("/publisher")
    .get(publisherController.getAll)
    .post(verifyAccessTokenAndAdmin, publisherController.add)

publisherRouter.put("/publisher/:id", verifyAccessTokenAndAdmin, publisherController.update)

module.exports = publisherRouter;