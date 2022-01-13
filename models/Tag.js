const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tagsSchema = new Schema(
    {
        label: String
    }
)

const TagsModel = mongoose.model("tags",  tagsSchema);

module.exports = TagsModel;


