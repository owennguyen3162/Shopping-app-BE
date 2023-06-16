const HomeController = require("../controllers/productController");

const Route = require("express").Router();

Route.get("/", HomeController.HomePage);

module.exports = Route;
