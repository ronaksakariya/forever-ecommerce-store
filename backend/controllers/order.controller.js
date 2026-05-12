import mongoose from "mongoose";
import crypto from "crypto";
import Razorpay from "razorpay";

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

const aggregateRequestedItems = (items) => {
  return items.reduce((aggregatedItems, item) => {
    const productId = String(item.productId || item.product || "");
    const size = item.size;
    const quantity = normalizeQuantity(item.quantity);
    const itemKey = `${productId}-${size}`;
    const existingItem = aggregatedItems.get(itemKey);

    if (existingItem) {
      existingItem.quantity += quantity;
      return aggregatedItems;
    }

    aggregatedItems.set(itemKey, {
      productId,
      size,
      quantity,
    });

    return aggregatedItems;
  }, new Map());
};

const getStockQuantity = (product, size) => {
  const stockItem = product.stock?.find((item) => item.size === size);
  return Number(stockItem?.quantity || 0);
};

const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new ApiError(500, "Razorpay credentials are not configured");
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

const buildOrderDetails = async ({ items, shippingAddress }) => {
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

  const requestedItems = [...aggregateRequestedItems(items).values()];

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

    const availableStock = getStockQuantity(product, item.size);
    if (availableStock < item.quantity) {
      throw new ApiError(
        400,
        `${product.name} has only ${availableStock} left in size ${item.size}`,
      );
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

  return {
    address,
    requestedItems,
    orderItems,
    subtotal,
    shippingFee: SHIPPING_FEE,
    total: subtotal + SHIPPING_FEE,
  };
};

const reduceStock = async (requestedItems) => {
  const stockUpdates = await Promise.all(
    requestedItems.map((item) =>
      Product.updateOne(
        {
          _id: item.productId,
          stock: {
            $elemMatch: {
              size: item.size,
              quantity: { $gte: item.quantity },
            },
          },
        },
        { $inc: { "stock.$.quantity": -item.quantity } },
      ),
    ),
  );

  if (stockUpdates.some((updateResult) => updateResult.modifiedCount !== 1)) {
    throw new ApiError(
      400,
      "one or more products no longer have enough stock",
    );
  }
};

export const placeOrder = asyncHandler(async (req, res) => {
  const { items, paymentMethod, shippingAddress } = req.body;

  if (paymentMethod !== "cod") {
    throw new ApiError(400, "invalid payment method");
  }

  const orderDetails = await buildOrderDetails({ items, shippingAddress });

  await reduceStock(orderDetails.requestedItems);

  const order = await Order.create({
    user: req.user._id,
    items: orderDetails.orderItems,
    shippingAddress: orderDetails.address,
    paymentMethod: "cod",
    paymentStatus: "Pending",
    status: "Order Placed",
    subtotal: orderDetails.subtotal,
    shippingFee: orderDetails.shippingFee,
    total: orderDetails.total,
  });

  req.user.cartData = [];
  await req.user.save({ validateBeforeSave: false });

  return res
    .status(201)
    .json(new ApiResponse(201, order, "order placed successfully"));
});

export const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { items, paymentMethod, shippingAddress } = req.body;

  if (paymentMethod !== "razorpay") {
    throw new ApiError(400, "invalid payment method");
  }

  const orderDetails = await buildOrderDetails({ items, shippingAddress });
  const razorpay = getRazorpayInstance();

  const order = await Order.create({
    user: req.user._id,
    items: orderDetails.orderItems,
    shippingAddress: orderDetails.address,
    paymentMethod: "razorpay",
    paymentStatus: "Pending",
    status: "Order Placed",
    subtotal: orderDetails.subtotal,
    shippingFee: orderDetails.shippingFee,
    total: orderDetails.total,
  });

  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(orderDetails.total * 100),
    currency: "INR",
    receipt: order._id.toString(),
  });

  order.razorpayOrderId = razorpayOrder.id;
  await order.save();

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        order,
        razorpayOrder,
        keyId: process.env.RAZORPAY_KEY_ID,
      },
      "Razorpay order created successfully",
    ),
  );
});

export const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const {
    orderId,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ApiError(400, "invalid order id");
  }

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new ApiError(400, "payment verification details are required");
  }

  if (!process.env.RAZORPAY_KEY_SECRET) {
    throw new ApiError(500, "Razorpay credentials are not configured");
  }

  const order = await Order.findOne({
    _id: orderId,
    user: req.user._id,
    paymentMethod: "razorpay",
  });

  if (!order) {
    throw new ApiError(404, "order not found");
  }

  if (order.paymentStatus === "Done") {
    return res
      .status(200)
      .json(new ApiResponse(200, order, "payment already verified"));
  }

  if (order.razorpayOrderId !== razorpay_order_id) {
    order.paymentStatus = "Failed";
    await order.save();
    throw new ApiError(400, "invalid Razorpay order id");
  }

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    order.paymentStatus = "Failed";
    await order.save();
    throw new ApiError(400, "payment verification failed");
  }

  const requestedItems = order.items.map((item) => ({
    productId: item.product.toString(),
    size: item.size,
    quantity: item.quantity,
  }));

  await reduceStock(requestedItems);

  order.paymentStatus = "Done";
  order.razorpayPaymentId = razorpay_payment_id;
  await order.save();

  req.user.cartData = [];
  await req.user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, order, "payment verified successfully"));
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
