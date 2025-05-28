const express = require("express");
const connectDB = require("./config/database");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const RecipeRouter = require("./routes/recipes");
const profileRouter = require("./routes/profile");
const app = express();
require("dotenv").config();

// const allowedOrigins = [
//   "http://localhost:5173",
//   "http://localhost:8080",
//   "http://13.61.152.61",
// ];

// const corsOptions = {
//   origin: function (origin, callback) {
//     // allow requests with no origin (like mobile apps or curl requests)
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.indexOf(origin) === -1) {
//       const msg =
//         "The CORS policy for this site does not " +
//         "allow access from the specified Origin.";
//       return callback(new Error(msg), false);
//     }
//     return callback(null, true);
//   },
//   credentials: true,
// };

// app.use(cors(corsOptions));

// ... rest of your backend code

app.use(express.json());
app.use(cookieParser());

// Simple request logger
app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.originalUrl}`);
  next();
});

app.use("/api", authRouter);
app.use("/api/recipes", RecipeRouter);
app.use("/api/profile", profileRouter);

connectDB()
  .then(() => {
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB", error);
  });
