const Api = require("./api.router");
const route = (app) => {
  app.use("/api", Api);
};

module.exports = route;
