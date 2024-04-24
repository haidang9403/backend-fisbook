const ApiError = require("../api-error");
const Publisher = require("../models/publisher.model");
const { publisherSchema, errorValidateAll } = require("../utils/validation_shema.util");

const publisherController = {
    // GET ALL publisher
    getAll: async (req, res, next) => {
        try {
            let sort = { updatedAt: -1 };
            const sortBy = req.query.sort;
            const publishers = req.query.publisher?.split(",")
            let query = {}
            if (publishers?.length > 0) {
                query = {
                    _id: {
                        $in: publishers
                    }
                }
            }

            if (sortBy) {
                const [key, value] = sortBy.split(" ")
                sort = {
                    [key]: value === 'asc' ? 1 : -1
                }
            }
            const allpublisher = await Publisher.find(query).sort(sort);
            res.send(allpublisher);
        } catch (err) {
            next(err);
        }
    },
    // ADD publisher
    add: async (req, res, next) => {
        try {
            const result = await publisherSchema.validate.validate(req.body, { abortEarly: false });
            const publisher = await Publisher.create(result);
            res.send(publisher);
        } catch (error) {
            errorValidateAll(res, error);

            next(
                new ApiError(500, "Error while adding publisher")
            )
        }
    },
    // UPDATE publisher
    update: async (req, res, next) => {
        try {
            const id = req.params.id;
            if (!id) throw new ApiError(400, "Invalid id publisher")

            const result = await publisherSchema.validate.validate(req.body, { abortEarly: false });

            const publisherUpdated = await Publisher.findByIdAndUpdate(id, result, { returnDocument: "after" });
            if (!publisherUpdated) throw new ApiError(500, "Can't update publisher");
            res.send(publisherUpdated);
        } catch (err) {
            errorValidateAll(res, err);

            next(err)
        }
    }
}

module.exports = publisherController;