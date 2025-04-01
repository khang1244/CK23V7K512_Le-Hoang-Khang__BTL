const jwt = require("jsonwebtoken");
const config = require("../config");

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Không có token" });

  jwt.verify(token, config.app.jwtSecret, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Token không hợp lệ" });
    req.user = decoded;
    next();
  });
}

module.exports = verifyToken;
