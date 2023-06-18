const express = require("express");
const productController = require("../controllers/productController");
const userController = require("../controllers/userController");
const cartController = require("../controllers/cartController");
const orderController = require("../controllers/orderController");
const notificationController = require("../controllers/notificationController");

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
Router.put("/user/:id", auth.isAuth, upload.single("userImage"), userController.updateAccount);
Router.post("/user/createAccount", userController.createAccount);
Router.post("/user/login", userController.login);

//cart
Router.post("/cart/addToCart", auth.isAuth, cartController.addToCart);
Router.post("/cart/checkout/:userId", auth.isAuth, cartController.checkout);

Router.delete(
  "/cart/removeToCart/:id",
  auth.isAuth,
  cartController.removeToCart
);
Router.get("/cart/:id", auth.isAuth, cartController.getCartById);

//order

Router.get("/order/:id", auth.isAuth, orderController.getOrder);
Router.get("/order/history/:id", auth.isAuth, orderController.getOrderHistory);
Router.delete(
  "/order/removeOrder/:id",
  auth.isAuth,
  orderController.deleteOrder
);

//notification
Router.post(
  "/user/sendNotification/:userId/:orderId/:status",
  notificationController.pushNotification
);
Router.delete(
  "/user/deleteNotification/:id",
  notificationController.deleteNotification
);

Router.get(
  "/user/getNotification/:userId",
  notificationController.getNotificationInDB
);

module.exports = Router;
