const Route = require("express").Router();
const SiteEffect = require("../controllers/SiteController");

Route.post("/login",SiteEffect.HandleLogin);
Route.get("/",SiteEffect.login);



module.exports = Route;