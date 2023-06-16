const Api = require("./api.router");
const Auth = require("./auth.router");
const Home = require("./home.router");

const route = (app) => {
  app.use("/api", Api);
  app.use("/auth", Auth);
  app.use("/home", Home);

};

module.exports = route;
