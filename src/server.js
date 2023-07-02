const express = require("express");
require("dotenv").config();
const PORT = process.env.PORT || 8080;
const app = express();
const route = require("./routes");
const fs = require("fs");
const dir = "./uploads";
const viewEngine = require("./config/viewEngine");
const methodOverride = require("method-override");
const session = require("express-session");
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SECRET_SESION,
    cookie: { maxAge: 60000 },
  })
);
viewEngine(app);
route(app);
app.listen(PORT, () => {
  console.log("LISTENING TO PORT " + PORT);
});
