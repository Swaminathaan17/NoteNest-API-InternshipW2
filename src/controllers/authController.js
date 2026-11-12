const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const signToken = (id) => jwt.sign(
  { userId: id.toString() },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
);

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (typeof name !== "string" || typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({ success: false, message: "Name, email, and password are required" });
    }
    if (name.trim().length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ success: false, message: "Enter a valid name and email address" });
    }
    if (password.length < 8 || password.length > 72) {
      return res.status(400).json({ success: false, message: "Password must be between 8 and 72 characters" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (await User.findOne({ email: normalizedEmail })) {
      return res.status(409).json({ success: false, message: "An account with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name: name.trim(), email: normalizedEmail, password: hashedPassword });
    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ success: false, message: "An account with this email already exists" });
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token: signToken(user._id),
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };
