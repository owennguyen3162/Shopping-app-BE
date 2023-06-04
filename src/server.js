const express = require("express");
require("dotenv").config();
const PORT = process.env.PORT || 8080;
const app = express();
const route = require("./routes");
const fs = require("fs");
const dir = "./uploads";

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
route(app);
app.listen(PORT, () => {
  console.log("LISTENING TO PORT " + PORT);
});
