const express = require("express");
const productController = require("../controllers/productController");
const userController = require("../controllers/userController");
const auth = require("../auth/auth.middleware");
const Router = express.Router();
const upload = require("../middlewares/upload");
//product
Router.post(
  "/products/addProduct",
  upload.single("imageProduct"),
  productController.addProduct
);
Router.get(
  "/products/bestSelling",
  auth.isAuth,
  productController.getBestSelling
);
Router.get("/products/newArrivals", productController.getNewArrivals);
Router.get("/products/:category", productController.getProductByCategory);

//user
Router.get("/user/:id", userController.getAccount);
Router.put("/user/:id", userController.updateAccount);
Router.post("/user/createAccount", userController.createAccount);
Router.post("/user/login", userController.login);

module.exports = Router;
