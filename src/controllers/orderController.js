const connect = require("../config/configDB");

//WEB

const getOrders = async (req, res) => {
  const query =
    "SELECT orders.id, orders.cartItem, orders.address, orders.options, orders.status, orders.totalPrice, user.name, user.phone  FROM orders INNER JOIN user ON user.id = orders.userId";
  try {
    const [data] = await connect.execute(query);
    res.render("Orders", { data });
  } catch (error) {
    res.status(500).json({ msg: "error" });
  }
};

const viewEditOrders = async (req, res) => {
  const { orderId } = await req.params;
  const query =
    "SELECT orders.id AS orderId, orders.cartItem, orders.address,orders.date, orders.options, orders.status, orders.totalPrice, user.name, user.phone, user.id AS userId  FROM orders INNER JOIN user ON user.id = orders.userId where orders.id = ?";
  try {
    const [data] = await connect.execute(query, [orderId]);
    res.render("EditOrder", { data: data[0] });
  } catch (error) {
    res.status(500).json({ msg: "error" });
  }
};
//API FOR MOBILE
const getOrder = async (req, res) => {
  const userId = await req.params.id;
  const query = 'SELECT * FROM orders WHERE userId = ? AND status <> "done" ';
  try {
    const [data] = await connect.execute(query, [userId]);
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ msg: "error" });
  }
};
const getOrderHistory = async (req, res) => {
  const userId = await req.params.id;
  const query = 'SELECT * FROM orders WHERE userId = ? AND status = "done" ';
  try {
    const [data] = await connect.execute(query, [userId]);
    res.status(200).json({ data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "error" });
  }
};

const deleteOrder = async (req, res) => {
  const orderId = await req.params.id;
  const query = "DELETE FROM orders WHERE id = ?";
  const queryUpdateCart = "UPDATE cart set checkout = ? WHERE id = ?";
  const querySelectOrders = "SELECT * FROM orders WHERE id = ?";

  try {
    const [data] = await connect.execute(querySelectOrders, [orderId]);
    //update cart item
    const dataNew = await JSON.parse(data[0].cartItem);
    await dataNew.map(async (item) => {
      await connect.execute(queryUpdateCart, [0, item.CartId]);
    });
    await connect.execute(query, [orderId]);
    res.status(204).json({ msg: "delete successfully" });
  } catch (error) {
    res.status(500).json({ msg: "error" });
  }
};

module.exports = {
  getOrder,
  deleteOrder,
  getOrders,
  viewEditOrders,
  getOrderHistory,
};
