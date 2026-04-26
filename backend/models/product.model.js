import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "product name cannot be empty"] },
    price: { type: Number, required: [true, "product price cannot be empty"] },
    description: {
      type: String,
      required: [true, "product description cannot be empty"],
    },
    images: {
      type: [String],
      required: [true, "product images cannot be empty"],
    },
    category: {
      type: String,
      required: [true, "product category cannot be empty"],
      enum: ["men", "women", "kids"],
    },
    subCategory: {
      type: String,
      required: [true, "product sub-category cannot be empty"],
      enum: ["bottomwear", "topwear", "winterwear"],
    },
    sizes: {
      type: [String],
      required: [true, "product sizes cannot be empty"],
      enum: ["S", "M", "L", "XL", "XXL"],
    },
    isBestseller: {
      type: Boolean,
      required: [true, "product isBestseller cannot be empty"],
    },
  },
  { timestamps: true },
);

export const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);
