const UserController = require("../controllers/userController");

const Route = require("express").Router();

Route.get("/", UserController.getUSers);

module.exports = Route;
