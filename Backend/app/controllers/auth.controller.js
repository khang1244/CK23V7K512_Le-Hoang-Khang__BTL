const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const MongoDB = require("../utils/mongodb.util");
const config = require("../config");

const usersCollection = () => MongoDB.getDB().collection("users"); // dùng getDB() để chắc chắn là contactbook

exports.register = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ message: "Thiếu username hoặc password" });

  const existingUser = await usersCollection().findOne({ username });
  if (existingUser)
    return res.status(400).json({ message: "Tài khoản đã tồn tại" });

  const hashedPassword = await bcrypt.hash(password, 10);
  await usersCollection().insertOne({ username, password: hashedPassword });

  res.status(201).json({ message: "Đăng ký thành công" });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  const user = await usersCollection().findOne({ username });
  if (!user)
    return res.status(400).json({ message: "Sai tài khoản hoặc mật khẩu" });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid)
    return res.status(400).json({ message: "Sai tài khoản hoặc mật khẩu" });

  const token = jwt.sign({ username }, config.jwtSecret, {
    expiresIn: "1d",
  });

  res.json({ token, username });
};
