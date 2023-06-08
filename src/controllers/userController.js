const bcrypt = require("bcrypt");
const connect = require("../config/configDB");
const authMethod = require("../auth/auth.methods");
const randToken = require("rand-token");
const createAccount = async (req, res) => {
  let { name, phone, password,token } = await req.body;
  if (!name || !password || !phone || !token) {
    return res.status(404).json({ msg: "Data empty" });
  }
  const query = "INSERT INTO user VALUES (?,?,?,?,?,?,?)";
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
      token,
      "https://static2.yan.vn/YanNews/2167221/202102/facebook-cap-nhat-avatar-doi-voi-tai-khoan-khong-su-dung-anh-dai-dien-e4abd14d.jpg",
    ]);
    res.status(201).json("insert successfully !");
  } catch (error) {
    res.status(500).json({ msg: "insert error " + error });
  }
};
const updateAccount = async () => {};

const login = async (req, res) => {
  let { phone, password } = await req.body;
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
    return res.status(200).json({
      msg: "login successfully",
      data: data[0],
    });
  } catch (error) {
    return res.status(500).json({ msg: "login fail" });
  }
};

const getAccount = async () => {};

module.exports = { createAccount, updateAccount, getAccount, login };
