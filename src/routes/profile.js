const express = require("express");
const userAuth = require("../middleware/userAuth");
const Recipe = require("../models/recipe");
const profileRouter = express.Router();
const User = require("../models/user");
const DISPLAY_FIELDS =
  "recipeTitle recipeDescription recipeImageUrl preparationTime cookingTime difficultyLevel recipeTag";

profileRouter.get("/view", userAuth, async (req, res) => {
  const user = req.user;
  try {
    const userRecipes = await Recipe.find({ recipeAuthorId: user._id })
      .select(DISPLAY_FIELDS)
      .populate("recipeAuthorId", "userName profileImageUrl aboutMe");

    res
      .status(200)
      .json({ message: "Profile fetched successfully", data: userRecipes });
  } catch (error) {
    res.status(500).json({ message: "Profile fetch failed", error });
  }
});

profileRouter.patch("/edit", userAuth, async (req, res) => {
  const user = req.user;
  try {
    const userProfile = await User.findById(user._id);
    const editableFields = ["userName", "profileImageUrl", "aboutMe"];
    Object.keys(req.body).forEach((key) => {
      if (!editableFields.includes(key)) {
        throw new Error("Invalid field");
      }
      userProfile[key] = req.body[key];
    });
    await userProfile.save();
    res
      .status(200)
      .json({ message: "Profile fetched successfully", data: userProfile });
  } catch (error) {
    console.log("error ", error);
    res
      .status(500)
      .json({ message: "Profile fetch failed", error: error.message });
  }
});
module.exports = profileRouter;
