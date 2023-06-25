const UserController = require("../controllers/userController");

const Route = require("express").Router();

Route.get("/", UserController.getUSers);
Route.get("/profile", UserController.profile);


module.exports = Route;
