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
        require: true,
    },
    amount: {
        type: Number,
        min: 0,
        default: 0,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "authors",
        required: true,
    },
    publisher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "publishers",
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "categories",
        required: true,
    },
},
    { timestamps: true }
)

const Book = mongoose.model("books", bookSchema);

module.exports = Book;