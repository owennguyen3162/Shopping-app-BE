const connect = require("../config/configDB");
const authMethod = require("../auth/auth.methods");
const session = require("express-session");
const login = (req, res) => {
  res.render("Login");
};
const HandleLogin = async (req, res) => {
  const { username, password } = await req.body;
  if (!username || !password) {
    return res.json({ msg: "login fail " });
  }

  const query = "SELECT * FROM user WHERE name = ? and role = 'admin'";
  try {
    const [data] = await connect.execute(query, [username]);
    if (data.length > 0) {
      if (data[0].password === password) {
        const payload = { username: data[0].name, role: data[0].role };
        const token = await authMethod.generateToken(
          payload,
          process.env.ACCESS_TOKEN_SECRET,
          process.env.ACCESS_TOKEN_LIFE_WEB
        );
        if (!token) {
          return res.json({ msg: "Error in generate token " });
        }
        req.session.User = {
          token: token,
        };
        return res.redirect("/home");
      }
      return res.json({ msg: "login fail !!" });
    } else {
      res.json({ msg: "Not found userName !!" });
    }
  } catch (error) {
    res.json({ msg: "login fail " + error });
  }
};

module.exports = { login, HandleLogin };
