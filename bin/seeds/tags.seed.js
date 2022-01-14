// create a test data set of valid users
require("dotenv").config();
require("./../../config/mongodb"); // fetch the db connection
const TagModel = require("../../models/Tag"); // fetch the model to validate our user document before insertion (in database)

const tags = [
  {
    label: "running"
  },
  {
    label: "basket"
  },
  {
    label: "football"
  }
];

(async function insertTags() {
  try {
    await TagModel.deleteMany(); // empty the tags db collection
    const inserted = await TagModel.insertMany(tags); // insert docs in db
    console.log(`seed tags done : ${inserted.length} documents inserted !`);
    process.exit();
  } catch (err) {
    console.error(err);
  }
})();
