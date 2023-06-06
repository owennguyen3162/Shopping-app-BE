const jwtVariable = require("../variables/jwt");
const authMethod = require("./auth.methods");
const connect = require("../config/configDB");

const refreshTokenFromBody = async (req, res) => {
  const accessTokenFromHeader = await req.headers.x_authorization;
  if (!accessTokenFromHeader) {
    return res.status(400).send("access token not found");
  }
  const refreshTokenFromBody = await req.body.refreshToken;
  if (!refreshTokenFromBody) {
    return res.status(400).send("refresh toke not found.");
  }
  const accessTokenSecret =
    process.env.ACCESS_TOKEN_SECRET || jwtVariable.accessTokenSecret;
  const accessTokenLife =
    process.env.ACCESS_TOKEN_LIFE || jwtVariable.accessTokenLife;

  const decoded = await authMethod.decodeToken(
    accessTokenFromHeader,
    accessTokenSecret
  );
  if (!decoded) {
    return res.status(400).send("Access token illegal.");
  }
  let refreshTokenToClient = await req.body.refreshTokenToClient;

  const phone = decoded.payload.phone;
  const query = "SELECT * FROM user WHERE phone = ?";
  try {
    let [data] = await connect.execute(query, [phone]);
    if (data.length === 0) {
      return res.status(404).send("User not found");
    }
    if (refreshTokenToClient !== refreshTokenFromBody) {
      return res.status(400).send("refreshToken error");
    }
    const dataForAccessToken = {
      phone: data[0].phone,
    };
    const accessToken = await authMethod.generateToken(
      dataForAccessToken,
      accessTokenSecret,
      accessTokenLife
    );
    if (!accessToken) {
      return res.status(401).json({ msg: "render accessToken fail" });
    }
    return res.status(201).json({
      accessToken,
    });
  } catch (error) {
    res.status(500).json({ msg: "get AccessToken new error" });
  }
};

module.exports = refreshTokenFromBody;
