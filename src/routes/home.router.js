const HomeController = require("../controllers/productController");
const upload = require("../middlewares/upload");
const Route = require("express").Router();
const auth = require("../auth/auth.middleware");
Route.use((req, res, next) => {
  const token = req.session.User;
  console.log(token);
  if (token) {
    req.headers.x_authorization = token.token;
  }
  next();
});

Route.post(
  "/addProduct/store",
  auth.isAuth,
  upload.single("imageProduct"),
  HomeController.addProduct
);
Route.delete(
  "/deleteProduct/:productId",
  auth.isAuth,
  HomeController.deleteProduct
);
Route.put(
  "/editProduct/:productId",
  auth.isAuth,
  upload.single("imageProduct"),
  HomeController.editProduct
);
Route.get("/addProduct", auth.isAuth, HomeController.viewAddProduct);
Route.get(
  "/editProduct/:productId",
  auth.isAuth,
  HomeController.viewEditProduct
);
Route.get("/", auth.isAuth, HomeController.HomePage);

module.exports = Route;
