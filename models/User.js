const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const usersSchema = new Schema(
    {
        name: String,
        lastname: String,
        email: String,
        password: String
    }
)

const usersModel = mongoose.model("users",  usersSchema);

module.exports = usersModel;

