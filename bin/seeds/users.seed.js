// create a test data set of valid users
require("dotenv").config();
require("../../config/mongodb"); // fetch the db connection
const UserModel = require("../../models/User"); // fetch the model to validate our user document before insertion (in database)

const tags = [
  {
    name: "admin",
    lastname: "toto",
    email: "admin@toto.com",
    password: "admin"
  }
];

(async function insertUsers() {
  try {
    await UserModel.deleteMany(); // empty the tags db collection
    const inserted = await UserModel.insertMany(tags); // insert docs in db
    console.log(`seed users done : ${inserted.length} documents inserted !`);
    process.exit();
  } catch (err) {
    console.error(err);
  }
})();
