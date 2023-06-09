const connect = require("../config/configDB");

const addToCart = async (req, res) => {
  let { userId, productId, size } = await req.body;
  if (!userId || !productId || !size) {
    return res.status(404).json({ msg: "empty data" });
  }
  const query = "INSERT INTO cart VALUES (?,?,?)";
  const queryInsertToProductCart = "INSERT INTO productcart VALUES (?,?,?,?)";
  try {
    const [data] = await connect.execute(query, [null, userId, false]);
    await connect.execute(queryInsertToProductCart, [
      null,
      data.insertId,
      productId,
      size,
    ]);

    return res.status(201).json({ msg: "add successfully" });
  } catch (error) {
    res.status(500).json({ msg: "add to cart error" });
  }
};

const removeToCart = async (req, res) => {
  const { id } = await req.params;
  const query = "DELETE FROM cart WHERE id = ? ";
  const queryDeleteRowInProductCart =
    "DELETE FROM productcart WHERE cartId = ? ";

  try {
    await connect.execute(queryDeleteRowInProductCart, [id]);
    await connect.execute(query, [id]);
    return res.status(204).json({ msg: "delete successfully" });
  } catch (error) {
    res.status(500).json({ msg: "add to cart error" });
  }
};

const getCartById = async (req, res) => {
  const { id } = await req.params;
  const query =
    "SELECT user.address ,cart.id ,product.name, product.image, productcart.size, product.price ,product.description FROM product INNER JOIN productcart ON product.id = productcart.productId INNER JOIN cart ON cart.id = productcart.cartId INNER JOIN user ON user.id = cart.userId WHERE user.id = ? AND cart.checkout = ?";
  try {
    let [data] = await connect.execute(query, [id, 0]);
    let dataNew = data.map((item) => {
      return {
        ...item,
        image: "http://192.168.0.103:3000/" + item.image,
      };
    });
    return res.status(200).json(dataNew);
  } catch (error) {
    res.status(500).json({ msg: "get data error" });
  }
};
const checkout = async (req, res) => {
  const { userId } = await req.params;
  const { address, options, totalPrice } = await req.body;
  if (!address || !options || !totalPrice) {
    return res.status(404).json({ msg: "empty value !!" });
  }
  const query =
    "SELECT cart.id AS CartId ,product.id AS productId,product.name, product.image, productcart.size, product.price ,product.description FROM product INNER JOIN productcart ON product.id = productcart.productId INNER JOIN cart ON cart.id = productcart.cartId INNER JOIN user ON user.id = cart.userId WHERE user.id = ? AND cart.checkout = ?";
  const insertToOrder = "INSERT INTO orders VALUES (?,?,?,?,?,?,?,?)";
  const queryUpdateCartItem = "UPDATE cart SET checkout = ? WHERE id = ?";

  try {
    let [data] = await connect.execute(query, [userId, 0]); // get data in cart now
    let dataNew = await data.map((item) => {
      return {
        ...item,
        image: "http://192.168.0.103:3000/" + item.image, //show image to client
      };
    });

    await connect.execute(insertToOrder, [
      null,
      JSON.stringify(dataNew),
      address,
      options,
      "waiting",
      totalPrice,
      userId,
      null,
    ]); // insert to order

    await data.map(async (item) => {
      await connect.execute(queryUpdateCartItem, [1, item.CartId]); //update instance checkout of cart => not show in cart from client
    });
    return res.status(201).json({ msg: "Check out successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Check out error" });
  }
};

module.exports = { addToCart, removeToCart, getCartById, checkout };
