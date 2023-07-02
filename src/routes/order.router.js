const OrderController = require("../controllers/orderController");
const NotificationController = require("../controllers/notificationController");

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
Route.get("/editOrder/:orderId",auth.isAuth, OrderController.viewEditOrders);
Route.put("/editOrder/:userId/:orderId",auth.isAuth, NotificationController.pushNotification);
Route.get("/",auth.isAuth, OrderController.getOrders);

module.exports = Route;
