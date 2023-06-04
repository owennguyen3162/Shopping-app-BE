const connection = require("../config/configDB");

const getAllProduct = async (req, res) => {
  const query = "SELECT * FROM Product";
  try {
    const [data] = await connection.execute(query);
    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const addProduct = async (req, res) => {
  const { name, price, quantity, category } = await req.body;
  let image;
  if (req.file) {
    image = req.file.filename;
  }
  if (!name || !price || !quantity || !category) {
    return res.status(500).json({ msg: "empty value" });
  }
  const query = "INSERT INTO Product VALUES (?,?,?,?,?,?)";
  try {
    await connection.execute(query, [
      null,
      image,
      name,
      price,
      quantity,
      category,
    ]);
    return res.status(201).json({ msg: "product created !!!" });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

module.exports = { getAllProduct, addProduct };
