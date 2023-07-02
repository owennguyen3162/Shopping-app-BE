const login = (req, res) => {
  res.render("Login");
};
const HandleLogin = (req, res) => {
  res.redirect("/home");
};

module.exports = { login, HandleLogin };
