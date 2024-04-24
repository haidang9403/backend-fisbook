const ApiError = require("../api-error");
const { borrowingSchema, errorValidateAll } = require("../utils/validation_shema.util");
const Borrowing = require("../models/borrowing.model");
const Book = require("../models/book.model")

const borrowingController = {
    // ADD BORROWING
    add: async (req, res, next) => {
        try {
            const addBorrow = await borrowingSchema.add.validate(req.body, { abortEarly: false });
            const book = await Book.findById(addBorrow.book_id);
            if (!book) throw new ApiError(404, "Book not found")
            if (book.amount <= 0) throw new ApiError(422, "Can't borrow book");

            const updatedBook = await Book.findByIdAndUpdate(addBorrow.book_id, { $inc: { amount: -1 } });

            if (!updatedBook) {
                throw new ApiError(500, "Failed to update book quantity");
            }

            const borrow = await Borrowing.create(addBorrow);
            res.send(borrow)
        } catch (err) {
            errorValidateAll(res, err);
            next(err)
        }
    },
    // GET ALL
    getAll: async (req, res, next) => {
        try {
            const status = req.query.status;

            let query = {};

            if (status) {
                query.status = status;
            }

            const allBorrow = await Borrowing.find(query)
                .populate('user_id')
                .populate('admin_id')
                .populate('book_id');
            res.send(allBorrow);
        } catch (err) {
            next(500, "Error when get data borrowing")
        }
    },
    // UPDATE
    update: async (req, res, next) => {
        try {
            const id = req.params.id;
            if (!id) throw new ApiError(400, "Invalid id borrowing");
            const admin_id = req.payload?.aud;
            if (!admin_id) throw new ApiError(400, "Can't update borrowing")

            const result = await borrowingSchema.update.validate({ ...req.body, admin_id }, { abortEarly: false });

            let updatedBook

            switch (result.status) {
                case 'Từ chối':
                case 'Đã trả':
                    updatedBook = await Book.findByIdAndUpdate(result.book_id, { $inc: { amount: +1 } });
                    if (!updatedBook) {
                        throw new ApiError(500, "Failed to update book quantity");
                    }
                    break;
            }


            const borrowUpdated = await Borrowing.findByIdAndUpdate(id, result, { returnDocument: "after" });
            if (!borrowUpdated) throw new ApiError(500, "Can't udpate borrowing");
            res.send(borrowUpdated);
        } catch (err) {
            errorValidateAll(res, err);
            return next(err);
        }
    },
    // GET ONE
    get: async (req, res, next) => {
        try {
            const id = req.params.id;
            if (!id) throw new ApiError(400, "Invalid id borrowing");

            const borrow = await Borrowing.findById(id)
                .populate("user_id")
                .populate("admin_id")
                .populate("book_id");

            if (!borrow) throw new ApiError(404, "Borrowing not found")
            res.send(borrow);
        } catch (err) {
            next(err)
        }
    }
}

module.exports = borrowingController;