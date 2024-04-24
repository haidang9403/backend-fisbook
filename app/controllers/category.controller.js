const ApiError = require("../api-error");
const Category = require("../models/category.model");
const { categorySchema, errorValidateAll } = require("../utils/validation_shema.util");

const categoryController = {
    // GET ALL category
    getAll: async (req, res, next) => {
        try {
            let sort = { updatedAt: -1 };
            const sortBy = req.query.sort;
            const categories = req.query.category?.split(",")
            let query = {}
            if (categories?.length > 0) {
                query = {
                    _id: {
                        $in: categories
                    }
                }
            }

            if (sortBy) {
                const [key, value] = sortBy.split(" ")
                sort = {
                    [key]: value === 'asc' ? 1 : -1
                }
            }
            const allcategory = await Category.find(query).sort(sort);
            res.send(allcategory);
        } catch (err) {
            next(err);
        }
    },
    // ADD category
    add: async (req, res, next) => {
        try {
            const result = await categorySchema.validate.validate(req.body, { abortEarly: false });
            const category = await Category.create(result);
            res.send(category);
        } catch (err) {
            errorValidateAll(res, err)

            next(err)
        }
    },
    // UPDATE category
    update: async (req, res, next) => {
        try {
            const id = req.params.id;
            if (!id) throw new ApiError(400, "Invalid id category")

            const result = await categorySchema.update.validateAsync(req.body, { abortEarly: false });

            const categoryUpdated = await Category.findByIdAndUpdate(id, result, { returnDocument: "after" });
            if (!categoryUpdated) throw new ApiError(500, "Can't update category");
            res.send(categoryUpdated);
        } catch (err) {
            errorValidateAll(res, err)


            next(err)
        }
    }
}

module.exports = categoryController;