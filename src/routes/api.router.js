const express = require("express");
const productController = require("../controllers/productController");
const userController = require("../controllers/userController");
const auth = require("../auth/auth.middleware");
const Router = express.Router();
const upload = require("../middlewares/upload");
//product
Router.post(
  "/products/addProduct",
  auth.isAuth,
  upload.single("imageProduct"),
  productController.addProduct
);
Router.get(
  "/products/bestSelling",
  auth.isAuth,
  productController.getBestSelling
);
Router.get(
  "/products/newArrivals",
  auth.isAuth,
  productController.getNewArrivals
);
Router.get(
  "/products/:category",
  auth.isAuth,
  productController.getProductByCategory
);

//user
Router.get("/user/:id", auth.isAuth, userController.getAccount);
Router.put("/user/:id", auth.isAuth, userController.updateAccount);
Router.post("/user/createAccount", userController.createAccount);
Router.post("/user/login", userController.login);

module.exports = Router;
