import { Product } from "../models/product.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const addProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    category,
    subCategory,
    sizes,
    isBestseller,
  } = req.body;
  const images = req.files;

  if (
    !name ||
    !price ||
    !description ||
    !category ||
    !subCategory ||
    !sizes ||
    !isBestseller ||
    !images
  ) {
    throw new ApiError(409, "all fields are required");
  }
  if (images.length === 0) {
    throw new ApiError(409, "at least one product image is required");
  }

  const productImages = await Promise.all(
    images?.map((imageItem) => uploadOnCloudinary(imageItem?.path)),
  );

  const productData = {
    name,
    price: Number(price),
    description,
    category,
    subCategory,
    sizes: JSON.parse(sizes),
    isBestseller: isBestseller === "true" ? true : false,
    images: productImages,
  };

  const product = await Product.create(productData);
  if (!product) {
    throw new ApiError(500, "something went wrong while creating product");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, product, "product created successfully"));
});

export const listProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  if (!products) {
    throw new ApiError(404, "no products found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, products, "products listed successfully"));
});

export const removeProduct = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    throw new ApiError(401, "product id is missing");
  }

  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    throw new ApiError(409, "product not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "product deleted successfully"));
});

export const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.body;

  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(409, "product not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, "product fetched successfully"));
});
