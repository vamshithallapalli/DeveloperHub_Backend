const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  try {
    let token = req.header("token");
    if (!token) {
      return res.status(400).send("token not found");
    }
    let decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decode.user;
    next();
  } catch (error) {
    console.log(error);
    res.status(400).send("Authentication Error");
  }
};
