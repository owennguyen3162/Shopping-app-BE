const UserController = require("../controllers/userController");

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
Route.get("/", auth.isAuth, UserController.getUSers);
Route.get("/profile", auth.isAuth, UserController.profile);

module.exports = Route;
