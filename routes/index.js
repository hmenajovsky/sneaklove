const express = require("express");
const router = express.Router();
const SneakerModel = require("../models/Sneaker");
const TagModel = require("../models/Tag");
const UserModel = require("../models/User");
const bcrypt = require("bcrypt"); // lib to encrypt data



console.log(`\n\n
-----------------------------
-----------------------------
     wax on / wax off !
-----------------------------
-----------------------------\n\n`
);

router.get("/home", (req, res, next) => {
  res.render("index");
});

router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/prod-add", (req, res, next) => {
  TagModel.find()
  .then((tags) =>  {
    res.render("products_add", {tags });
  })
  .catch(next);
});

/*router.post("/tag-add", async (req, res, next) => {
  try {
    await TagModel.create(req.body);
    res.redirect("/prod-add");
  } catch (err) {
    next(err);
  }
});*/

router.post("/prod-add", async (req, res, next) => {
  try {
    await SneakerModel.create(req.body);
    res.redirect("/");
  } catch (err) {
    next(err);
  }
});

router.get("/sneakers/:cat", async  (req, res, next) => {
  try {
    res.render("products", {
      sneakers: await SneakerModel.find({ category: { $eq: req.params.cat} }), //cat
      //sneakers: await SneakerModel.find(), //collection
      tags : await TagModel.find()
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
    }
    else {
        const hashedPassword = bcrypt.hashSync(newUser.password, 10);
        newUser.password = hashedPassword;
        await UserModel.create(newUser);
        req.flash("success", "Congrats ! You are now registered !");
        res.redirect("/auth/signin");
    }
}

catch (err) {
    let errorMessage = "";
    console.log(err);
    for (field in err.errors) {
        errorMessage += err.errors[field].message + "\n";
    }
    req.flash("error", errorMessage);
    res.redirect("/signup");
    }
 next(err)
});

router.get("/signin", (req, res, next) => {
  //res.send("love");
  res.render("signin");
});


module.exports = router;
