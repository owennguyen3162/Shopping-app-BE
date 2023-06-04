const express = require("express");
const productController = require("../controllers/productController");
const Router = express.Router();
const upload = require("../middlewares/upload");
Router.post(
  "/addProduct",
  upload.single("imageProduct"),
  productController.addProduct
);
Router.get("/", productController.getAllProduct);
module.exports = Router;
