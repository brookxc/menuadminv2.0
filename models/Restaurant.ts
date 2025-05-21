import mongoose from "mongoose"

// Define the menu item schema
const MenuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
})

// Define the menu category schema
const MenuCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  items: {
    type: [MenuItemSchema],
    default: [],
  },
})

// Update the restaurant schema to include coverPhoto
const RestaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    logo: {
      type: String,
      default: null,
    },
    coverPhoto: {
      type: String,
      default: null,
    },
    menuCategories: {
      type: [MenuCategorySchema],
      default: [],
    },
    themeColor: {
      type: String,
      default: "#3B82F6", // Default blue color
    },
    locked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

// Check if the model is already defined to prevent overwriting
const Restaurant = mongoose.models.Restaurant || mongoose.model("Restaurant", RestaurantSchema)

export default Restaurant
