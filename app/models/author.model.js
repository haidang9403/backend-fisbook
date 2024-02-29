const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const authorSchema = new Schema({
    fullname: {
        type: String,
        required: true,
    }
},
    { timestamps: true }
);

const Author = mongoose.model("authors", authorSchema);

module.exports = Author;