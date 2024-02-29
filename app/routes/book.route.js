const express = require("express");
const bookController = require("../controllers/book.controller");
const upload = require("../utils/upload_img.util");

const bookRoute = express.Router();

bookRoute.route("/book")
    .get(bookController.getAll)
    .post(upload.single("photo"), bookController.add) // Adding book

bookRoute.route("/book/:id")
    .get(bookController.getById)
    .put(upload.single("photo"), bookController.update) // Updating book
    .delete(bookController.delete) // Deleting book

bookRoute.get("/book/author/:author_id", (req, res) => {
    res.send("Get book by author");
})

bookRoute.get("/book/category/:category_id", (req, res) => {
    res.send("Get book by category");
})

bookRoute.get("/book/publisher/:publisher_id", (req, res) => {
    res.send("Get book by publisher");
})

module.exports = bookRoute;