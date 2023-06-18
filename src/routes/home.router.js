const HomeController = require("../controllers/productController");
const upload = require("../middlewares/upload");
const Route = require("express").Router();

Route.post(
  "/addProduct/store",
  upload.single("imageProduct"),
  HomeController.addProduct
);
Route.delete("/deleteProduct/:productId",HomeController.deleteProduct);
Route.put("/editProduct/:productId", upload.single("imageProduct"),HomeController.editProduct);
Route.get("/addProduct", HomeController.viewAddProduct);
Route.get("/editProduct/:productId", HomeController.viewEditProduct);
Route.get("/", HomeController.HomePage);

module.exports = Route;
