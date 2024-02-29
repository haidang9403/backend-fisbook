const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        min: 0,
    },
    amount: {
        type: Number,
        min: 0,
        default: 0,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "authors",
    },
    publisher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "publishers",
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "categories",
    },
},
    { timestamps: true }
)

const Book = mongoose.model("books", bookSchema);

module.exports = Book;