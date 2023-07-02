const authMethod = require("./auth.methods");
const connect = require("../config/configDB");

exports.isAuth = async (req, res, next) => {
  const accessTokenFromHeader = req.headers.x_authorization;
  if (!accessTokenFromHeader) {
    return res.status(401).send("401 access token not found!");
  }

  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

  const verified = await authMethod.verifyToken(
    accessTokenFromHeader,
    accessTokenSecret
  );
  if (!verified) {
    return res.status(401).send("401 You do not have access to this feature!");
  }
  const query = "SELECT * FROM user WHERE phone = ?";
  try {
    let [data] = await connect.execute(query, [verified.payload.phone]);
    if (data.length !== 0) {
      req.user = data[0];
    }
  } catch (error) {
    console.log("auth error " + error);
  }
  return next();
};
