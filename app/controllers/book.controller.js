const Book = require("../models/book.model");
const Author = require("../models/author.model")
const fs = require("fs");
const config = require("../config/index");
const ApiError = require("../api-error");
const { bookSchema, errorValidateAll } = require("../utils/validation_shema.util");
const stringSimilarity = require("string-similarity");

const bookController = {
    // GET ALL BOOKS
    getAll: async (req, res, next) => {
        try {
            const { sort, limit, random, _neId, ...filter } = req.query;

            let conditions = {};
            let randomSkip = 0;
            let query = {
                ...filter
            }
            if (random === 'true') {
                const totalItems = await Book.countDocuments(filter);
                const maxRandomSkip = Math.max(totalItems - parseInt(limit), 0);
                randomSkip = Math.floor(Math.random() * (maxRandomSkip + 1));
            }
            if (sort) {
                const sortArray = sort.split(",").map(condition => condition.trim());
                sortArray.forEach(condition => {
                    const [field, order] = condition.split(' ');
                    conditions[field] = order === 'asc' ? 1 : -1;
                });
            }
            if (_neId) {
                query = {
                    ...query,
                    _id: { $ne: _neId }
                }
            }

            const books = await Book.find(query)
                .populate('author', 'fullname')
                .populate('category', 'title')
                .populate('publisher', 'name').sort(conditions).limit(limit).skip(randomSkip);

            res.send(books);
        } catch (error) {
            next(error);
        }
    },
    // ADD BOOK
    add: async (req, res, next) => {
        try {
            let img
            const filename = req.file?.filename;
            if (filename) {
                img = config.upload.baseUrl + filename;
            } else img = '';

            const result = await bookSchema.validate.validate({ ...req.body, img }, { abortEarly: false });
            const book = new Book(result);
            const savedBook = await book.save();
            return res.send(savedBook);
        } catch (error) {
            if (req.file) {
                fs.unlink(req.file.path, (errFs) => {
                    if (errFs) {
                        return next(error)
                    }
                })
            }

            if (error.name === "ValidationError") {
                errorValidateAll(res, error);
            } else {
                return next(error)
            }


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

            const book = await Book.findById(bookId)
                .populate('author', 'fullname')
                .populate('category', 'title')
                .populate('publisher', 'name');

            if (!book) throw next(new ApiError(404, "Book not found"));

            res.send(book);
        } catch (err) {
            next(err);
        }
    },
    // UPDATE BOOK
    update: async (req, res, next) => {
        try {
            const id = req.params.id;
            // Handle img
            const filename = req.file ? req.file.filename : undefined;
            let img = ''
            if (filename) {
                img = config.upload.baseUrl + filename;
                req.body = {
                    ...req.body,
                    img,
                }
            } else {
                img = (await Book.findById(id))._doc.img;
            }

            // Validate data
            if (!id) throw new ApiError(404, "Id book not empty");
            const result = await bookSchema.validate.validate({ ...req.body, img }, { abortEarly: false });


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
                next(new ApiError(404, "Book not found"));
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
        } catch (error) {
            if (req.file) {
                fs.unlink(req.file.path, (errFs) => {
                    if (errFs) {
                        return next(errFs)
                    }
                })
            }

            if (error.name === "ValidationError") {
                errorValidateAll(res, error);
            } else {
                return next(error)
            }
        }
    },
    // GET BOOK BY AUTHOR
    getByAuthor: async (req, res, next) => {
        try {
            const { _id: id, fullname } = req.query;
            let isQuery = false;
            let bookFilter;
            let authorQuery = {};

            // Nếu có _id được cung cấp trong query, tìm kiếm và trả về
            if (id) {
                isQuery = true;
                // Chuyển id thành mảng nếu nó không phải là mảng
                const ids = Array.isArray(id) ? id : [id];
                // Thêm điều kiện tìm kiếm vào query
                bookFilter = await Book.find({ author: ids }).populate("author");
            } else {
                // Nếu có fullname được cung cấp trong query, thêm vào điều kiện tìm kiếm
                if (fullname) {
                    isQuery = true
                    // Chuyển fullname thành mảng nếu nó không phải là mảng
                    const fullnames = Array.isArray(fullname) ? fullname : [fullname];
                    // Tạo mảng các tên gần đúng
                    const authors = await Author.find({}, 'fullname');
                    const allMatches = fullnames.map(singleFullname => {
                        const matches = stringSimilarity.findBestMatch(singleFullname, authors.map(author => author.fullname));
                        const threshold = 0.2; // Ngưỡng tương đồng
                        return matches.ratings.filter(match => match.rating >= threshold).map(match => match.target);
                    });
                    // Gộp các tên gần đúng lại thành một mảng duy nhất
                    const bestMatches = allMatches.reduce((acc, curr) => acc.concat(curr), []);
                    // Thêm điều kiện tìm kiếm vào query
                    authorQuery.fullname = { $in: bestMatches };
                }

                // Nếu không có cả _id và fullname, không cần thêm điều kiện tìm kiếm về tác giả

                // Tiến hành tìm kiếm sách dựa trên các điều kiện tìm kiếm về tác giả
                const matchedAuthors = await Author.find(authorQuery);
                const authorIds = matchedAuthors.map(author => author._id);

                // Nếu không có cả _id và fullname, không cần thêm điều kiện tìm kiếm về tác giả
                bookFilter = isQuery ? await Book.find({ author: { $in: authorIds } }).populate('author') : await Book.find().populate('author');
            }

            // Trả về danh sách sách tìm thấy
            res.send(bookFilter);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = bookController;