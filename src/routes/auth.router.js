const Router = require("express").Router();
const authController = require("../auth/auth.controller")

Router.post("/refreshToken", authController);

module.exports = Router;
