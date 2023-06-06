const express = require("express");
const viewEngine = (app) => {
  app.use(express.static("./uploads"));
};

module.exports = viewEngine;
