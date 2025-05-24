const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    recipeAuthorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipeTitle: {
      type: String,
      index: true,
      required: true,
    },
    recipeDescription: {
      type: String,
    },
    recipeImageUrl: {
      type: String,
      default: "https://via.placeholder.com/150",
    },
    recipeIngredients: {
      type: [String],
      required: true,
    },
    recipeInstructions: {
      type: [String],
      required: true,
    },

    preparationTime: {
      type: Number,
      required: true,
    },
    cookingTime: {
      type: Number,
      required: true,
    },
    servings: {
      type: Number,
      required: true,
    },
    difficultyLevel: {
      type: String,
      enum: {
        values: ["Easy", "Medium", "Hard"],
        message: "{VALUE} is invalid ",
      },
      required: true,
    },
    recipeMealType: {
      type: String,
      enum: {
        values: ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert"],
        message: "{VALUE} is invalid ",
      },
      required: true,
    },
    recipeTag: {
      type: [String],
      enum: {
        values: [
          "Vegan",
          "Vegetarian",
          "Non-Vegetarian",
          "Gluten-Free",
          "Dairy-Free",
          "Low-Calorie",
          "High-Protein",
          "Quick Meal",
          "Healthy"
        ],
        message: "{VALUE} is invalid ",
      },
    },
  },
  { timestamps: true }
);

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
