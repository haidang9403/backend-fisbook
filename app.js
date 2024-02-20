const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoute = require("./app/routes/auth.route");
const ApiError = require("./app/api-error");


const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());


// Routes
app.use("/api/bookstore", authRoute);

// Handle not found 404
app.use((req, res, next) => {
    return next(new ApiError(404, "Resoure not found"));
})

// Define error-handling middleware last
app.use((err, req, res, next) => {
    return res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error",
    })
})

module.exports = app;