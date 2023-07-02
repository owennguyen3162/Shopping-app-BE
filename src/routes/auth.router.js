const Router = require("express").Router();
const authController = require("../auth/auth.controller")
const auth = require("../auth/auth.middleware");
Router.use((req, res, next) => {
  const token = req.session.User;
  console.log(token);
  if (token) {
    req.headers.x_authorization = token.token;
  }
  next();
});
Router.post("/refreshToken",auth.isAuth, authController);

module.exports = Router;
