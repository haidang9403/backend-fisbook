const mongoose = require("mongoose");

const connection = (uri) => {
    mongoose
        .connect(uri)
        .then(() => {
            console.log('Connected to the database!');
        })
        .catch((error) => {
            console.log('Cannot connect to the database!', error);
        })
}

module.exports = connection;