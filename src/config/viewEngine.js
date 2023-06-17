const express = require("express");
const viewEngine = (app) => {
  app.use(express.static("./uploads"));
  app.use(express.static("./src/public/assets"));
  app.use('/home',express.static("./src/public/assets"));
  app.set('views', './src/views')
  app.set('view engine', 'ejs')
};

module.exports = viewEngine;
