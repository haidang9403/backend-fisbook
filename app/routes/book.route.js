const express = require("express");
const bookController = require("../controllers/book.controller");
const upload = require("../utils/upload_img.util");
const JWT = require("../utils/jwt.util");

const bookRouter = express.Router();

bookRouter.route("/book")
    .get(bookController.getAll)
    .post(JWT.verifyAccessTokenAndAdmin, upload.single("photo"), bookController.add) // Adding book

bookRouter.route("/book/:id")
    .get(bookController.getById)
    .put(JWT.verifyAccessTokenAndAdmin, upload.single("photo"), bookController.update) // Updating book
    .delete(JWT.verifyAccessTokenAndAdmin, bookController.delete) // Deleting book

bookRouter.get("/book/v1/search", bookController.getByAuthor)


module.exports = bookRouter;