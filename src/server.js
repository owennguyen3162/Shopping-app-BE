const express = require("express");
require("dotenv").config();
const PORT = process.env.PORT || 8080;
const app = express();
const route = require("./routes");
const fs = require("fs");
const dir = "./uploads";
const viewEngine = require("./config/viewEngine")
const methodOverride = require('method-override')
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
viewEngine(app);
route(app);
app.listen(PORT, () => {
  console.log("LISTENING TO PORT " + PORT);
});
