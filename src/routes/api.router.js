const express = require("express");
const productController = require("../controllers/productController");
const Router = express.Router();
const upload = require("../middlewares/upload");
Router.post(
  "/products/addProduct",
  upload.single("imageProduct"),
  productController.addProduct
);
Router.get("/products/bestSelling", productController.getBestSelling);
Router.get("/products/newArrivals", productController.getNewArrivals);
Router.get("/products/:category", productController.getProductByCategory);

module.exports = Router;
