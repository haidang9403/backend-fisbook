const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const borrowingSchema = new Schema({
    book_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "books",
        required: true,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    admin_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "admins",
    },
    status: {
        type: String,
        enum: ['Chưa duyệt', 'Đang mượn', 'Đã trả'],
        default: 'Chưa duyệt',
    },
    total_money: {
        type: Number,
    },
    borrow_at: {
        type: Date,
        default: Date.now,
    },
    return_at: {
        type: Date,
    }
});

// Defien total money
borrowingSchema.pre('save', async function (next) {
    try {
        const Book = mongoose.model('books');
        const book = await Book.findById(this.book_id);

        this.total_money = book.price;

        next();
    } catch (error) {
        next(error);
    }
})

const Borrowing = mongoose.model("borrowings", borrowingSchema)

module.exports = Borrowing;