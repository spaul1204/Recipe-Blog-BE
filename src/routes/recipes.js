const express = require("express");
const Recipe = require("../models/recipe");
const userAuth = require("../middleware/userAuth");
const RecipeRouter = express.Router();

const DISPLAY_FIELDS =
  "servings recipeTitle recipeDescription recipeImageUrl preparationTime cookingTime difficultyLevel recipeTag recipeMealType recipeIngredients recipeInstructions";

RecipeRouter.post("/add-recipe", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const recipeAuthorId = user._id;
    const {
      recipeTitle,
      recipeDescription,
      recipeImageUrl,
      recipeIngredients,
      recipeInstructions,
      preparationTime,
      cookingTime,
      servings,
      difficultyLevel,
      recipeMealType,
      recipeTag,
    } = req.body;

    const recipe = new Recipe({
      recipeAuthorId,
      recipeTitle,
      recipeDescription,
      recipeImageUrl,
      recipeIngredients,
      recipeInstructions,
      preparationTime,
      cookingTime,
      servings,
      difficultyLevel,
      recipeMealType,
      recipeTag,
    });

    await recipe.save();
    res
      .status(201)
      .json({ message: "Recipe created successfully", data: recipe });
  } catch (error) {
    console.log("error in creating recipe", error);
    res.status(400).json({ message: "Recipe creation failed", error });
  }
});

RecipeRouter.get("/get-recipes", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const { mealType, difficulty, tags } = req.query;
    const query = {
      recipeAuthorId: user._id,
    };

    if (mealType) query.recipeMealType = mealType;
    if (difficulty) query.difficultyLevel = difficulty;
    if (tags) query.recipeTag = tags;

    const recipes = await Recipe.find(query)
      .populate("recipeAuthorId", "userName")
      .select(DISPLAY_FIELDS);

    res.status(200).json({ message: "Recipes fetched successfully", recipes });
  } catch (error) {
    console.log("error in fetching recipes", error);
    res.status(400).json({ message: "Recipe fetching failed", error });
  }
});

RecipeRouter.get("/search-recipes", userAuth, async (req, res) => {
  try {
    const { searchQuery } = req.query;
    console.log("searchQuery", searchQuery);

    const filteredRecipes = await Recipe.find({
      $or: [
        { recipeTitle: { $regex: searchQuery, $options: "i" } },
        { recipeDescription: { $regex: searchQuery, $options: "i" } },
        {
          recipeIngredients: {
            $elemMatch: { $regex: searchQuery, $options: "i" },
          },
        },
        { recipeTag: { $regex: searchQuery, $options: "i" } },
      ],
    });

    console.log("filteredRecipes", filteredRecipes);
    res
      .status(200)
      .json({ message: "Recipes fetched successfully", data: filteredRecipes });
  } catch (error) {
    console.log("error in filtering recipes", error);
    res.status(400).json({ message: "Recipe filtering failed", error });
  }
});

RecipeRouter.patch("/edit-recipe/:recipeId", userAuth, async (req, res) => {
  try {
    const { recipeId } = req.params;
    const updateData = req.body;

    // Validate recipeId
    if (!recipeId) {
      return res.status(400).json({
        success: false,
        message: "Recipe ID is required",
      });
    }

    // Validate that the recipe belongs to the user
    const existingRecipe = await Recipe.findOne({
      _id: recipeId,
      recipeAuthorId: req.user._id,
    });

    if (!existingRecipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found or you don't have permission to edit it",
      });
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(recipeId, updateData, {
      new: true,
      runValidators: true,
      context: "query",
    }).populate("recipeAuthorId", "userName");

    if (!updatedRecipe) {
      return res.status(500).json({
        success: false,
        message: "Failed to update recipe",
      });
    }

    res.status(200).json({
      success: true,
      message: "Recipe updated successfully",
      recipe: updatedRecipe,
    });
  } catch (error) {
    console.error("Error updating recipe:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update recipe",
    });
  }
});

RecipeRouter.delete("/delete-recipe/:recipeId", userAuth, async (req, res) => {
  try {
    const { recipeId } = req.params;

    // Validate that the recipe belongs to the user
    const existingRecipe = await Recipe.findOne({
      _id: recipeId,
      recipeAuthorId: req.user._id,
    });

    if (!existingRecipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found or you don't have permission to delete it",
      });
    }

    const deletedRecipe = await Recipe.findByIdAndDelete(recipeId);

    res.status(200).json({
      success: true,
      message: "Recipe deleted successfully",
      recipe: deletedRecipe,
    });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    res.status(500).json({
      success: false,
      message: "Recipe deletion failed",
      error: error.message,
    });
  }
});

RecipeRouter.get("/add-to-favorites/:recipeId", userAuth, async (req, res) => {
  try {
    const { recipeId } = req.params;
    const user = req.user;
    console.log("user", user);
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    user.favoriteRecipes.push(recipeId);
    await user.save();
    res.status(200).json({ message: "Recipe added to favorites", user });
  } catch (error) {
    console.log("error in adding to favorites", error);
    res.status(400).json({ message: "Adding to favorites failed", error });
  }
});

RecipeRouter.get("/get-favorites", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const favorites = await Recipe.find({ _id: { $in: user.favoriteRecipes } });
    res
      .status(200)
      .json({ message: "Favorites fetched successfully", favorites });
  } catch (error) {
    console.log("error in fetching favorites", error);
    res.status(400).json({ message: "Fetching favorites failed", error });
  }
});

module.exports = RecipeRouter;
