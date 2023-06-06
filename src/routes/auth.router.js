const Router = require("express").Router();
const authController = require("../auth/auth.controller")

Router.get("/refreshToken", authController);

module.exports = Router;
