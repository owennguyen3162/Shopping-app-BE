const Route = require("express").Router();
const StatisticsController = require("../controllers/statistics");

Route.get("/",StatisticsController.statisticsView);
Route.post("/query",StatisticsController.queryStatistics);


module.exports = Route;