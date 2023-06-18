const bcrypt = require("bcrypt");
const connect = require("../config/configDB");
const authMethod = require("../auth/auth.methods");
const randToken = require("rand-token");
const jwtVariable = require("../variables/jwt");

//WEB

const getUSers = async (req, res) => {
  const query = "SELECT * FROM user";
  try {
    const [data] = await connect.execute(query);
    res.render("User", { data });
  } catch (error) {
    res.json({ msg: error });
  }
};

//API FOR MOBILE
const createAccount = async (req, res) => {
  let { name, phone, password, token } = await req.body;
  if (!name || !password || !phone) {
    return res.status(404).json({ msg: "Data empty" });
  }
  const query = "INSERT INTO user VALUES (?,?,?,?,?,?)";
  const saltRounds = 10;
  const genSalt = bcrypt.genSaltSync(saltRounds);
  password = bcrypt.hashSync(password, genSalt);
  try {
    await connect.execute(query, [
      null,
      phone,
      name,
      "ba vi",
      password,
      "https://static2.yan.vn/YanNews/2167221/202102/facebook-cap-nhat-avatar-doi-voi-tai-khoan-khong-su-dung-anh-dai-dien-e4abd14d.jpg",
    ]);
    res.status(201).json("insert successfully !");
  } catch (error) {
    res.status(500).json({ msg: "insert error " + error });
  }
};
const updateAccount = async (req, res) => {
  const { name, address } = await req.body;
  const { id } = await req.params;
  let image = await req.file.filename;
  let query = "UPDATE user SET name = ? , address = ?, image = ? WHERE id = ?";

  try {
    await connect.execute(query, [name, address, image, id]);
    return res.status(200).json({ msg: "update successfully" });
  } catch (error) {
    return res.status(500).json({ msg: error });
  }
};

const login = async (req, res) => {
  let { phone, password, fcmToken } = await req.body;
  const query = "SELECT * FROM user WHERE phone = ?";
  try {
    let [data] = await connect.execute(query, [phone]);
    if (data.length === 0) {
      return res.status(404).json({ msg: "not found" });
    }
    let checkPass = bcrypt.compareSync(password, data[0].password);
    if (!checkPass) {
      return res.status(404).json({ msg: "wrong password" });
    }
    const accessTokenSecret =
      process.env.ACCESS_TOKEN_SECRET || jwtVariable.accessTokenSecret;
    const accessTokenLife =
      process.env.ACCESS_TOKEN_LIFE || jwtVariable.accessTokenLife;

    const dataForAccessToken = { phone: data[0].phone };
    const accessToken = await authMethod.generateToken(
      dataForAccessToken,
      accessTokenSecret,
      accessTokenLife
    );
    if (!accessToken) {
      return res.status(401).json({ msg: "render accessToken fail" });
    }
    let refreshToken = randToken.generate(120);
    data[0].accessToken = accessToken;
    data[0].refreshToken = refreshToken;
    return (await updateFcmToken(fcmToken, phone))
      ? res.status(200).json({
          msg: "login successfully",
          data: data[0],
        })
      : res.status(500).json({
          msg: "login fail",
        });
  } catch (error) {
    return res.status(500).json({ msg: "login fail" + error });
  }
};

const getAccount = async (req, res) => {
  const { id } = await req.params;
  const query = "SELECT name , phone, address, image FROM user WHERE id = ?";
  try {
    const [data] = await connect.execute(query, [id]);
    const dataNew = data.map((item) => {
      return { ...item, image: `http://192.168.0.103:3000/${item.image}` };
    });
    res.status(200).json({ data: dataNew[0] });
  } catch (error) {
    return res.status(500).json({ msg: "get user failed" + error });
  }
};

const updateFcmToken = async (token, phone) => {
  const query = "UPDATE user set fcmToken = ? where phone = ?";
  try {
    await connect.execute(query, [token, phone]);
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = { getUSers, createAccount, updateAccount, getAccount, login };
