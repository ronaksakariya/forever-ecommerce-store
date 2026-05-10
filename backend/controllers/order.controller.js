import mongoose from "mongoose";

import { Order, ORDER_STATUSES } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const SHIPPING_FEE = 10;

const requiredAddressFields = [
  "name",
  "email",
  "street",
  "city",
  "state",
  "zip",
  "country",
  "phone",
];

const normalizeQuantity = (quantity) => {
  const parsedQuantity = Number(quantity);
  return Number.isFinite(parsedQuantity) && parsedQuantity > 0
    ? Math.floor(parsedQuantity)
    : 0;
};

const normalizeAddress = (shippingAddress = {}) => {
  return requiredAddressFields.reduce((address, field) => {
    address[field] = String(shippingAddress[field] || "").trim();
    return address;
  }, {});
};

export const placeOrder = asyncHandler(async (req, res) => {
  const { items, paymentMethod, shippingAddress } = req.body;

  if (paymentMethod !== "cod") {
    throw new ApiError(400, "Cash on Delivery is the only available payment");
  }

  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, "order items are required");
  }

  const address = normalizeAddress(shippingAddress);
  const missingAddressField = requiredAddressFields.find(
    (field) => !address[field],
  );

  if (missingAddressField) {
    throw new ApiError(400, "all delivery details are required");
  }

  const requestedItems = items.map((item) => ({
    productId: String(item.productId || item.product || ""),
    size: item.size,
    quantity: normalizeQuantity(item.quantity),
  }));

  if (
    requestedItems.some(
      (item) =>
        !mongoose.Types.ObjectId.isValid(item.productId) ||
        !item.size ||
        item.quantity < 1,
    )
  ) {
    throw new ApiError(400, "invalid order item");
  }

  const productIds = requestedItems.map((item) => item.productId);
  const products = await Product.find({ _id: { $in: productIds } });
  const productsById = new Map(
    products.map((product) => [product._id.toString(), product]),
  );

  const orderItems = requestedItems.map((item) => {
    const product = productsById.get(item.productId);

    if (!product) {
      throw new ApiError(404, "one or more products were not found");
    }

    if (!product.sizes.includes(item.size)) {
      throw new ApiError(400, `${product.name} is not available in that size`);
    }

    return {
      product: product._id,
      name: product.name,
      image: product.images?.[0] || "",
      price: product.price,
      size: item.size,
      quantity: item.quantity,
    };
  });

  const subtotal = orderItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress: address,
    paymentMethod: "cod",
    paymentStatus: "Pending",
    status: "Order Placed",
    subtotal,
    shippingFee: SHIPPING_FEE,
    total: subtotal + SHIPPING_FEE,
  });

  req.user.cartData = [];
  await req.user.save({ validateBeforeSave: false });

  return res
    .status(201)
    .json(new ApiResponse(201, order, "order placed successfully"));
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({
    createdAt: -1,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, orders, "orders fetched successfully"));
});

export const getAdminOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, orders, "orders fetched successfully"));
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ApiError(400, "invalid order id");
  }

  if (!ORDER_STATUSES.includes(status)) {
    throw new ApiError(400, "invalid order status");
  }

  const order = await Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true, runValidators: true },
  );

  if (!order) {
    throw new ApiError(404, "order not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, order, "order status updated successfully"));
});
