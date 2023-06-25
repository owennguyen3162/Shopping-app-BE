const Api = require("./api.router");
const Auth = require("./auth.router");
const Home = require("./home.router");
const User = require("./user.router");
const Order = require("./order.router");
const Statistics = require("./statistics");

const route = (app) => {
  app.use("/api", Api);
  app.use("/auth", Auth);
  app.use("/home", Home);
  app.use("/user", User);
  app.use("/order", Order);
  app.use("/statistics", Statistics);

};

module.exports = route;
