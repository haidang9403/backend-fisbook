const Book = require("../models/book.model");
const fs = require("fs");
const config = require("../config/index");
const ApiError = require("../api-error");
const { bookSchema } = require("../utils/validation_shema.util");

const bookController = {
    // GET ALL BOOKS
    getAll: async (req, res, next) => {
        try {
            const books = await Book.find();
            res.send(books);
        } catch (error) {
            next(error);
        }
    },
    // ADD BOOK
    add: async (req, res, next) => {
        try {
            const { filename } = req.file;
            img = config.upload.baseUrl + filename;

            const result = await bookSchema.add.validateAsync({ ...req.body, img });
            const book = new Book(result);
            const savedBook = await book.save();
            res.send(savedBook);
        } catch (error) {
            if (error.isJoi) {
                error.statusCode = 400;
            }

            fs.unlink(req.file.path, (errFs) => {
                if (errFs) {
                    next(error)
                }
            })

            next(error)
        }
    },
    // DELETE BOOK
    delete: async (req, res, next) => {
        try {
            const bookID = req.params.id;
            const bookDeleted = await Book.findById(bookID);
            if (!bookDeleted) throw new ApiError(400, "Bad request");

            const { img } = bookDeleted._doc;
            const fileNameImg = img.split("/").pop();
            const pathImg = "public\\uploads\\" + fileNameImg;

            fs.unlink(pathImg, async (err) => {
                if (err) {
                    return next(new ApiError(500, "Can't delete book"));
                }
                await Book.deleteOne(bookDeleted._doc);
                res.send(bookDeleted);
            })

        } catch (err) {
            next(err)
        }
    },
    // GET ONE BOOK
    getById: async (req, res, next) => {
        try {
            const bookId = req.params.id;
            if (!bookId) throw next(new ApiError(400, "Id book invalid"));

            const book = await Book.findById(bookId);
            if (!book) throw next(new ApiError(404, "Book not found"));

            res.send(book);
        } catch (err) {
            next(err);
        }
    },
    update: async (req, res, next) => {
        try {
            // Handle img
            const filename = req.file ? req.file.filename : undefined;
            if (filename) {
                img = config.upload.baseUrl + filename;
                req.body = {
                    ...req.body,
                    img,
                }
            }

            // Validate data
            const id = req.params.id;
            if (!id) throw next(new ApiError(404, "Id book not empty"));
            const result = await bookSchema.update.validateAsync(req.body);

            // Update
            const bookUpdated = await Book.findByIdAndUpdate(id, result);
            if (!bookUpdated) {
                if (filename) {
                    fs.unlink(req.file.path, async (err) => {
                        if (err) {
                            return next(new ApiError(500, "Can't delete img"));
                        };
                    }) // If can't update book, then remove new img
                }
                throw next(new ApiError(404, "Book not found"));
            }

            // Update successful
            if (filename) {
                const { img } = bookUpdated._doc;
                const fileNameImg = img.split("/").pop();
                const pathImg = "public\\uploads\\" + fileNameImg;
                fs.unlink(pathImg, async (err) => {
                    if (err) {
                        return next(new ApiError(500, "Can't delete img"));
                    };
                });
            }

            const bookUpdateAfter = await Book.findById(id);
            res.send(bookUpdateAfter);
        } catch (err) {
            if (err.isJoi) {
                err.statusCode = 400;
                err.message = "Can't update book";
            }
            next(err)
        }
    }
}

module.exports = bookController;