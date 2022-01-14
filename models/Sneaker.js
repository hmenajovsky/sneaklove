const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sneakerSchema = new Schema(
    {
        name: String,
        ref: String,
        size: Number,
        description: String,
        price: Number,
        image: {
            type: String,
            default: "https://res.cloudinary.com/dkl4m3xbn/image/upload/v1642186404/ebay_3d_viewing_sneaker_yxntpv.jpg",
        },
        category: {
            type: String,
            enum: ["men", "women", "kids"]
        },
        id_tags: {
            type: [Schema.Types.ObjectId],
            ref: "tags"
        }
    }
);

const SneakerModel = mongoose.model("sneakers",  sneakerSchema);

module.exports = SneakerModel;

