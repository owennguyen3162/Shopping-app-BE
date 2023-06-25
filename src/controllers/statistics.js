const connect = require("../config/configDB");

const statisticsView = (req, res) => {
  res.render("Statistics", { data: 0 });
};

const queryStatistics = async (req, res) => {
  const { beginDate, endDate } = await req.body;
  const query =
    "SELECT SUM(totalPrice) AS price FROM `orders` WHERE status = 'done' AND  date BETWEEN ? AND ? ";
  try {
    const [data] = await connect.execute(query, [beginDate, endDate]);
    res.render("Statistics", { data: data[0].price });
  } catch (error) {
    res.json({ error: error });
  }
};

module.exports = { statisticsView, queryStatistics };
