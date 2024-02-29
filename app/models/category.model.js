const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    title: {
        type: String,
        reuqired: true,
    }
},
    { timestamps: true }
);

const Category = mongoose.model("categories", categorySchema);

module.exports = Category;