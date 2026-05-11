import { Product } from "../models/product.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const PRODUCT_SIZES = ["S", "M", "L", "XL", "XXL"];
const PRODUCT_CATEGORIES = ["men", "women", "kids"];
const PRODUCT_SUB_CATEGORIES = ["bottomwear", "topwear", "winterwear"];

const parseJsonField = (value, fieldName) => {
  if (typeof value !== "string") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    throw new ApiError(400, `${fieldName} is invalid`);
  }
};

const normalizeSizesAndStock = (rawSizes, rawStock) => {
  const sizes = parseJsonField(rawSizes, "sizes");
  const stock = parseJsonField(rawStock, "stock");

  if (!Array.isArray(sizes) || sizes.length === 0) {
    throw new ApiError(400, "please select at least one product size");
  }

  const normalizedSizes = [...new Set(sizes.map((size) => String(size)))];

  if (normalizedSizes.some((size) => !PRODUCT_SIZES.includes(size))) {
    throw new ApiError(400, "one or more product sizes are invalid");
  }

  if (!Array.isArray(stock)) {
    throw new ApiError(400, "stock is required");
  }

  const stockBySize = new Map();
  stock.forEach((stockItem) => {
    const size = String(stockItem?.size || "");
    const quantity = Number(stockItem?.quantity);

    if (
      !PRODUCT_SIZES.includes(size) ||
      !Number.isInteger(quantity) ||
      quantity < 0
    ) {
      throw new ApiError(400, "stock quantities must be whole numbers");
    }

    stockBySize.set(size, quantity);
  });

  const normalizedStock = normalizedSizes.map((size) => {
    if (!stockBySize.has(size)) {
      throw new ApiError(400, `stock is missing for size ${size}`);
    }

    return {
      size,
      quantity: stockBySize.get(size),
    };
  });

  return { sizes: normalizedSizes, stock: normalizedStock };
};

const normalizeProductInput = (body) => {
  const {
    name,
    price,
    description,
    category,
    subCategory,
    sizes,
    stock,
    isBestseller,
  } = body;

  if (
    !String(name || "").trim() ||
    !String(description || "").trim() ||
    !category ||
    !subCategory ||
    sizes === undefined ||
    stock === undefined ||
    isBestseller === undefined
  ) {
    throw new ApiError(400, "all fields are required");
  }

  const productPrice = Number(price);
  if (!Number.isFinite(productPrice) || productPrice <= 0) {
    throw new ApiError(400, "price must be greater than zero");
  }

  if (!PRODUCT_CATEGORIES.includes(category)) {
    throw new ApiError(400, "product category is invalid");
  }

  if (!PRODUCT_SUB_CATEGORIES.includes(subCategory)) {
    throw new ApiError(400, "product sub-category is invalid");
  }

  const normalizedInventory = normalizeSizesAndStock(sizes, stock);

  return {
    name: String(name).trim(),
    price: productPrice,
    description: String(description).trim(),
    category,
    subCategory,
    ...normalizedInventory,
    isBestseller: isBestseller === true || isBestseller === "true",
  };
};

export const addProduct = asyncHandler(async (req, res) => {
  const images = req.files;

  if (!images || images.length === 0) {
    throw new ApiError(400, "at least one product image is required");
  }

  const productImages = await Promise.all(
    images?.map((imageItem) => uploadOnCloudinary(imageItem?.path)),
  );

  const productData = {
    ...normalizeProductInput(req.body),
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
    throw new ApiError(400, "product id is missing");
  }

  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    throw new ApiError(404, "product not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "product deleted successfully"));
});

export const getProduct = asyncHandler(async (req, res) => {
  const id = req.params.id || req.query.id || req.body.id;

  if (!id) {
    throw new ApiError(400, "product id is missing");
  }

  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, "product not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, "product fetched successfully"));
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "product id is missing");
  }

  const productData = normalizeProductInput(req.body);

  const product = await Product.findByIdAndUpdate(id, productData, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    throw new ApiError(404, "product not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, "product updated successfully"));
});
