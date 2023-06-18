const OrderController = require("../controllers/orderController");
const NotificationController = require("../controllers/notificationController");

const Route = require("express").Router();

Route.get("/editOrder/:orderId", OrderController.viewEditOrders);
Route.put("/editOrder/:userId/:orderId", NotificationController.pushNotification);
Route.get("/", OrderController.getOrders);

module.exports = Route;
