const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    const decodedValue = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decodedValue.userId;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("error in userAuth middleware", error);
    res.status(401).json({
      message: "Unauthorized",
    });
  }
};

module.exports = userAuth;
