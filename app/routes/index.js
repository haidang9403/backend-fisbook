const express = require("express");

const authRouter = require("./auth.route");
const bookRouter = require("./book.route");

const mainRouter = express.Router();

mainRouter.use(
    authRouter,
    bookRouter
)

module.exports = mainRouter;