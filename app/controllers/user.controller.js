const ApiError = require("../api-error");
const User = require("../models/user.model");
const Book = require("../models/book.model")
const Author = require("../models/author.model")
const Borrowing = require("../models/borrowing.model");
const JWT = require("../utils/jwt.util");
const { userSchema, errorValidateAll, errorValidate } = require("../utils/validation_shema.util");
const fs = require("fs");
const config = require("../config/index");



const UserController = {
    getAll: async (req, res, next) => {
        try {
            const filter = req.query;
            const data = await User.find(filter);
            res.send(data)
        } catch (error) {
            next(error)
        }
    },
    getDetailUser: async (req, res, next) => {
        try {
            const id = req.params.id;
            if (!id) next(new ApiError(422, "Id user not empty"));

            const user = await User.findById(id);
            if (!user) next(new ApiError(404, "User not found"));

            const borrowings = await Borrowing.find({ user_id: id })
                .populate({
                    path: "book_id",
                    model: Book,
                    populate: {
                        path: 'author',
                        model: Author
                    }
                });

            res.status(200).send({ ...user._doc, borrowings });
        } catch (error) {
            next(error)
        }
    },
    update: async (req, res, next) => {
        try {
            const id = req.params.id;
            if (!id) next(new ApiError(422, "Id user not empty"));

            const infoUser = await userSchema.update.validate(req.body, { abortEarly: false })

            const updatedUser = await User.findByIdAndUpdate(id, infoUser);
            res.send(updatedUser);
        } catch (error) {
            if (error.name === "ValidationError") {
                errorValidateAll(res, error);
            } else {
                return next(error)
            }
        }
    },
    updateImage: async (req, res, next) => {
        try {

            const id = req.params.id;

            let image
            const filename = req.file?.filename;
            if (filename) {
                image = config.upload.baseUrl + filename;
            } else img = '';


            if (!id) next(new ApiError(404, "Id not found"));
            const result = await userSchema.updateImage.validate({ image });

            const userUpdate = await User.findByIdAndUpdate(id, result);

            if (!userUpdate) {
                if (filename) {
                    fs.unlink(req.file.path, async (err) => {
                        if (err) {
                            return next(new ApiError(500, "Can't delete img"));
                        };
                    }) // If can't update book, then remove new img
                }
                return next(new ApiError(404, "User not found"));
            }

            if (filename) {
                const { image } = userUpdate._doc;
                if (image) {
                    const fileNameImg = image.split("/").pop();
                    const pathImg = "public\\uploads\\" + fileNameImg;
                    fs.unlink(pathImg, async (err) => {
                        if (err) {
                            return next(new ApiError(500, "Can't delete img"));
                        };
                    });
                }
            }
            return res.send({ image });
        } catch (error) {
            if (req.file) {
                fs.unlink(req.file.path, (errFs) => {
                    if (errFs) {
                        return next(errFs)
                    }
                })
            }

            if (error.name === "ValidationError") {
                errorValidate(res, error);
            } else {
                return next(error)
            }
        }

    },
    updateFull: async (req, res, next) => {
        try {
            const id = req.params.id;
            if (!id) next(new ApiError(422, "Id user not empty"));

            const infoUser = await userSchema.updateFull.validate(req.body, { abortEarly: false })

            const updatedUser = await User.findByIdAndUpdate(id, infoUser);
            res.send(updatedUser);
        } catch (error) {
            if (error.name === "ValidationError") {
                errorValidateAll(res, error);
            } else {
                return next(error)
            }
        }
    }
}

module.exports = UserController;
