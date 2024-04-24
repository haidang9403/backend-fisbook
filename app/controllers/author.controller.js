const ApiError = require("../api-error");
const Author = require("../models/author.model");
const { authorSchema, errorValidateAll } = require("../utils/validation_shema.util");

const authorController = {
    // GET ALL AUTHOR
    getAll: async (req, res, next) => {
        try {
            let sort = { updatedAt: -1 };
            const sortBy = req.query.sort;
            const authors = req.query.author?.split(",")
            let query = {}
            if (authors?.length > 0) {
                query = {
                    _id: {
                        $in: authors
                    }
                }
            }


            if (sortBy) {
                const [key, value] = sortBy.split(" ")
                sort = {
                    [key]: value === 'asc' ? 1 : -1
                }
            }

            const allAuthor = await Author.find(query).sort(sort);
            res.send(allAuthor);
        } catch (err) {
            next(err);
        }
    },
    // ADD AUTHOR
    add: async (req, res, next) => {
        try {
            const result = await authorSchema.validate.validate(req.body, { abortEarly: false });
            const author = await Author.create(result);
            res.send(author);
        } catch (err) {
            errorValidateAll(res, err)

            next(err)
        }
    },
    // UPDATE AUTHOR
    update: async (req, res, next) => {
        try {
            const id = req.params.id;
            if (!id) throw new ApiError(400, "Invalid id author")

            const result = await authorSchema.validate.validate(req.body, { abortEarly: false });

            const authorUpdated = await Author.findByIdAndUpdate(id, result, { returnDocument: "after" });
            if (!authorUpdated) throw new ApiError(500, "Can't update author");
            res.send(authorUpdated);
        } catch (err) {
            errorValidateAll(res, err)


            next(err)
        }
    },

}

module.exports = authorController;