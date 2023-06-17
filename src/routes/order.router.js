const OrderController = require("../controllers/orderController");

const Route = require("express").Router();

Route.get("/", OrderController.getOrders);

module.exports = Route;
