const Route = require("express").Router();
const StatisticsController = require("../controllers/statistics");
const auth = require("../auth/auth.middleware");
Route.use((req, res, next) => {
  const token = req.session.User;
  console.log(token);
  if (token) {
    req.headers.x_authorization = token.token;
  }
  next();
});
Route.get("/", auth.isAuth, StatisticsController.statisticsView);
Route.post("/query", auth.isAuth, StatisticsController.queryStatistics);

module.exports = Route;
