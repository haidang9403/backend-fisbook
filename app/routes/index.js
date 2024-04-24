const express = require("express");

const authRouter = require("./auth.route");
const bookRouter = require("./book.route");
const authorRouter = require("./author.route");
const publisherRouter = require("./publisher.route");
const categoryRouter = require("./category.route")
const borrowingRouter = require("./borrowing.route")
const userRouter = require("./user.route")
const adminRouter = require("./admin.route")

const mainRouter = express.Router();

mainRouter.use(
    authRouter,
    bookRouter,
    authorRouter,
    publisherRouter,
    categoryRouter,
    borrowingRouter,
    userRouter,
    adminRouter
)

module.exports = mainRouter;