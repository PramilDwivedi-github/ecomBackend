const jwt = require("jsonwebtoken");

const generateToken = async (palyload) => {
  const token = await jwt.sign(palyload, process.env.tokenKey);
  return token;
};

const authenticateToken = async (req, res, next) => {
  try {
    var token = req.headers.authorization.split(" ")[1];
    console.log(typeof token);
    jwt.verify(token, process.env.tokenKey, (err, data) => {
      if (err) {
        res.status(400).send({ message: "Invalid Token" });
      } else {
        // res.status(200).send({ message: "success", data });
        req.UserData = data;
        next();
      }
    });
  } catch (e) {
    e.message = "Unable to verify token";
  }
};

module.exports = { generateToken, authenticateToken };
