const express = require("express");
const router = express.Router();
const SneakerModel = require("../models/Sneaker");
const TagModel = require("../models/Tag");
const UserModel = require("../models/User");
const bcrypt = require("bcrypt"); // lib to encrypt data
const uploader = require("./../config/cloudinary");
const protectPrivateRoute = require("../middlewares/protectPrivateRoute");

console.log(`\n\n
-----------------------------
-----------------------------
     wax on / wax off !
-----------------------------
-----------------------------\n\n`);

router.get("/home", (req, res, next) => {
  res.render("index");
});

router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/prod-add", protectPrivateRoute, (req, res, next) => {
  TagModel.find()
    .then(tags => {
      res.render("products_add", { tags });
    })
    .catch(next);
});

router.post("/tag-add", async (req, res, next) => {
  try {
    await TagModel.create(req.body);
    res.redirect("/prod-add");
  } catch (err) {
    next(err);
  }
});

router.post("/prod-add", uploader.single("image"), async (req, res, next) => {
  const sneaker = { ...req.body };
  if (!req.file) sneaker.image = undefined;
  else sneaker.image = req.file.path;

  try {
    await SneakerModel.create(sneaker);
    res.redirect("/");
  } catch (err) {
    next(err);
  }
});

router.get("/sneakers/:cat", async (req, res, next) => {
  try {
    const filteredSneakers =
      req.params.cat === "collection" //if cat is collection
        ? await SneakerModel.find() // all
        : await SneakerModel.find({ category: { $eq: req.params.cat } }); // men, kids or women
    res.render("products", {
      sneakers: filteredSneakers,
      category: req.params.cat,
      tags: await TagModel.find()
    });
  } catch (err) {
    next(err);
  }
});

router.get("/one-product/:id", async (req, res, next) => {
  //res.send("baz");
  try {
    const sneaker = await SneakerModel.findById(req.params.id);
    res.render("one_product", { sneaker });
  } catch (err) {
    next(err);
  }
});

router.get("/prod-edit/:id", protectPrivateRoute, async (req, res, next) => {
  try {
    const tags = await TagModel.find();
    const sneaker = await SneakerModel.findById(req.params.id).populate("tags");
    res.render("product_edit", { sneaker, tags });
  } catch (err) {
    next(err);
  }
});

router.post("/prod-edit/:id", uploader.single("image"), async (req, res, next) => {
  try {
    const sneaker = { ...req.body };
    if (req.file) albumToUpdate.image = req.file.path;

    await SneakerModel.findByIdAndUpdate(req.params.id, sneaker);
    res.redirect("/one-product/" + req.params.id);
  } catch (err) {
    next(err);
  }
});

router.get("/prod-delete/:id", protectPrivateRoute, async (req, res, next) => {
  try {
    await SneakerModel.findByIdAndRemove(req.params.id);
    res.redirect("/sneakers/collection");
  } catch (err) {
    next(err);
  }
});

router.get("/signup", (req, res, next) => {
  //res.send("sneak");
  res.render("signup");
});

router.post("/signup", async (req, res, next) => {
  try {
    const newUser = { ...req.body };
    const foundUser = await UserModel.findOne({ email: newUser.email });
    if (foundUser) {
      req.flash("warning", "Email already registered");
      res.redirect("/signin");
    } else {
      const hashedPassword = bcrypt.hashSync(newUser.password, 10);
      newUser.password = hashedPassword;
      await UserModel.create(newUser);
      req.flash("success", "Congrats ! You are now registered !");
      res.redirect("/signin");
    }
  } catch (err) {
    let errorMessage = "";
    console.log(err);
    for (field in err.errors) {
      errorMessage += err.errors[field].message + "\n";
    }
    req.flash("error", errorMessage);
    res.redirect("/signup");
  }
  next(err);
});

router.get("/signin", (req, res, next) => {
  //res.send("love");
  res.render("signin");
});

router.post("/signin", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const foundUser = await UserModel.findOne({ email: email });
    if (!foundUser) {
      //console.log('FLASH >',req.flash("error", "Invalid credentials"));
      // display 1
      req.flash("error", "Invalid credentials");
      //console.log('error_msg >>', res.locals.error_msg)  ;
      //display []
      res.redirect("/signin");
    } else {
      const isSamePassword = bcrypt.compareSync(password, foundUser.password);
      if (!isSamePassword) {
        req.flash("error", "Invalid credentials");
        res.redirect("/prod-add");
      } else {
        const userObject = foundUser.toObject();
        delete userObject.password;
        req.session.currentUser = userObject;
        req.flash("success", "Successfully logged in...");
        res.redirect("/prod-add");
      }
    }
  } catch (err) {
    next(err);
  }
});

router.get("/logout", (req, res, next) => {
  req.session.destroy(err => res.redirect("/home"));
});

module.exports = router;
