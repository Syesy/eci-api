const jwt = require("jsonwebtoken");

const HMAC_JWT_SECRET = process.env.HMAC_JWT_SECRET;

const User = require("./models/User");
module.exports = async (req, res, next) => {
  const token = req.headers.authorization;
  console.log("Token", token);
  try {
    const payload = jwt.verify(token, HMAC_JWT_SECRET);
    req.user = await User.findOne({
      where: {
        id: payload.userId
      }
    });
    if (!req.user) throw new Error("User doesn't exist");
  } catch (e) {
    return res.sendStatus(403);
  }

  next();
};
