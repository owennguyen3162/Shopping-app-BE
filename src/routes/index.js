const Api = require("./api.router");
const Auth = require("./auth.router");

const route = (app) => {
  app.use("/api", Api);
  app.use("/auth", Auth);
};

module.exports = route;
