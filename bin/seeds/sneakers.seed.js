// create a test data set of valid users
require("dotenv").config();
require("../../config/mongodb"); // fetch the db connection
const SneakerModel = require("../../models/Sneaker"); // fetch the model to validate our user document before insertion (in database)

const sneakers = [
  {
    name: "sneaker2",
    ref: "ref2",
    size: "38",
    description: "lorem ipsum dolor",
    price: 150,
    category: "women",
    id_tags: null
  },
  {
    name: "sneaker3",
    ref: "ref3",
    size: "32",
    description: "great for kids",
    price: 150,
    category: "kids",
    id_tags: null
  },
  {
    name: "sneaker4",
    ref: "ref4",
    size: "41",
    description: "great for men",
    price: 350,
    category: "men",
    id_tags: null
  }
];

(async function insertSneakers() {
  try {
    await SneakerModel.deleteMany(); // empty the tags db collection
    
    const tags = await Promise.all([
      TagModel.findOne({ label: "label1" }),
      TagModel.findOne({ label: "label2" }),
      TagModel.findOne({ label: "label3" }),
    ]);

    sneakers[0].id_tags = tags[2];
    sneakers[1].id_tags = tags[0];
    sneakers[2].id_tags = tags[1];    
    
    const inserted = await SneakerModel.insertMany(sneakers); // insert docs in db
    console.log(`seed sneakers done : ${inserted.length} documents inserted !`);
    process.exit();
  } catch (err) {
    console.error(err);
  }
})();
