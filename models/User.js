const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        name: String,
        lastname: String,
        email: String,
        password: String
    }
)

const UserModel = mongoose.model("users",  userSchema);

module.exports = UserModel;

