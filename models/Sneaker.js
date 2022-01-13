const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sneakersSchema = new Schema(
    {
        name: String,
        ref: String,
        size: Number,
        description: String,
        price: Number,
        category: {
            type: String,
            enum: [men, women, kids]
        },
        id_tags: [Schema.Types.ObjectId]
    }
)

const SneakersModel = mongoose.model("sneakers",  sneakersSchema);

module.exports = SneakersModel;

