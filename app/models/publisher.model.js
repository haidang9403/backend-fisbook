const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const publisherSchema = new Schema({
    name: {
        type: String,
        reuqired: true,
    }
},
    { timestamps: true }
);

const Publisher = mongoose.model("publishers", publisherSchema);

module.exports = Publisher;