const connection = require("../config/configDB");

//Controller for WEB

const HomePage = async (req, res) => {
  const query = "SELECT * FROM product";
  try {
    const [data] = await connection.execute(query);
    res.render("Home", { data: data });
  } catch (error) {
    res.json({ msg: error });
  }
};

const deleteProduct = async (req, res) => {
  const { productId } = await req.params;
  const query = "DELETE FROM product where id = ?";
  try {
    await connection.execute(query, [productId]);
    res.redirect("back");
  } catch (error) {
    res.json({ msg: error });
  }
};

//Controller for API

const getProductByCategory = async (req, res) => {
  const category = await req.params.category;
  const query = "SELECT * FROM product WHERE category = ?";

  try {
    const [data] = await connection.execute(query, [category]);
    const dataNew = data.map((item) => {
      return { ...item, image: "http://192.168.0.103:3000/" + item.image };
    });
    return res.status(200).json({ data: dataNew });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const viewAddProduct = (req, res) => {
  res.render("AddProduct");
};

const editProduct = async (req, res) => {
  const { productId } = await req.params;
  const { name, description, price, quantity, category } = await req.body;
  let query =
    "UPDATE product SET name = ?, description = ?, price = ?, quantity = ?, category = ? WHERE id = ?";
  let image;
  if (await req.file) {
    query =
      "UPDATE product SET name = ?, description = ?, price = ?, quantity = ?, category = ?, image = ? WHERE id = ?";
    image = await req.file.filename;
  }
  try {
    req.file
      ? await connection.execute(query, [
          name,
          description,
          price,
          quantity,
          category,
          image,
          productId,
        ])
      : await connection.execute(query, [
          name,
          description,
          price,
          quantity,
          category,
          productId,
        ]);
    return res.redirect("/home");
  } catch (error) {
    res.json({ msg: error });
  }
};

const viewEditProduct = async (req, res) => {
  const { productId } = await req.params;
  const query = "SELECT * FROM product WHERE id = ?";
  try {
    const [data] = await connection.execute(query, [productId]);
    res.render("EditProduct", { data: data[0] });
  } catch (error) {
    res.json({ msg: error });
  }
};

const addProduct = async (req, res) => {
  const { name, price, quantity, category, description } = await req.body;
  let image;
  if (req.file) {
    image = await req.file.filename;
  }
  if (!name || !price || !quantity || !category || !description) {
    return res.status(500).json({ msg: "empty value" });
  }
  const query = "INSERT INTO product VALUES (?,?,?,?,?,?,?,?)";
  try {
    await connection.execute(query, [
      null,
      image,
      name,
      price,
      quantity,
      category,
      description,
      null,
    ]);
    return res.redirect("back");
  } catch (error) {
    return res.json({ error });
  }
};

const getNewArrivals = async (req, res) => {
  const query =
    "SELECT * FROM product WHERE time > date_sub(now(), interval 1 day)"; // lay cac san pham duoc tao 1 ngay truoc
  try {
    const [data] = await connection.execute(query);
    if (data.length !== 0) {
      const dataNew = data.map((item) => {
        return { ...item, image: "http://192.168.0.103:3000/" + item.image };
      });
      return res.status(200).json({ data: dataNew });
    } else {
      const query =
        "SELECT * FROM product WHERE time > date_sub(now(), interval 1 month)"; // lay cac san pham duoc tao 1 ngay truoc
      const [data] = await connection.execute(query);
      if (data.length !== 0) {
        const dataNew = data.map((item) => {
          return { ...item, image: "http://192.168.0.103:3000/" + item.image };
        });
        return res.status(200).json({ data: dataNew });
      }
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const getBestSelling = async (req, res) => {
  const query = "SELECT * FROM product WHERE quantity > 10";
  try {
    const [data] = await connection.execute(query);
    const dataNew = data.map((item) => {
      return { ...item, image: "http://192.168.0.103:3000/" + item.image };
    });
    return res.status(200).json({ data: dataNew });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

module.exports = {
  getProductByCategory,
  addProduct,
  getNewArrivals,
  getBestSelling,
  HomePage,
  viewAddProduct,
  deleteProduct,
  editProduct,
  viewEditProduct,
};
