const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TagSchema = new Schema(
    {
        label: String
    }
)

const TagModel = mongoose.model("tags",  TagSchema);

module.exports = TagModel;


