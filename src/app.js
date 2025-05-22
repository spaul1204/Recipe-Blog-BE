const express = require("express");
const connectDB = require("./config/database");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const RecipeRouter = require("./routes/recipes");
const profileRouter = require("./routes/profile");
const app = express();
require("dotenv").config();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/recipes", RecipeRouter);
app.use("/profile", profileRouter);

connectDB()
  .then(() => {
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB", error);
  });
