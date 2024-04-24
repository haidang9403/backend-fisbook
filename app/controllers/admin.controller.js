const ApiError = require("../api-error");
const Admin = require("../models/admin.model");
const Borrowing = require("../models/borrowing.model")
const JWT = require("../utils/jwt.util");

const UserController = {
    getAll: async (req, res, next) => {
        try {
            const filter = req.query;
            const data = await Admin.find(filter);
            res.send(data)
        } catch (error) {
            next(error)
        }
    },
    getDetails: async (req, res, next) => {
        try {
            const id = req.params.id;
            if (!id) next(new ApiError(422, "Id user not empty"));

            const admin = await Admin.findById(id);
            if (!admin) next(new ApiError(404, "User not found"));

            const { password, ...infoAdmin } = admin._doc

            res.status(200).send(infoAdmin);
        } catch (error) {
            next(error)
        }
    },
}

module.exports = UserController;
