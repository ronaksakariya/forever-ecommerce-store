import mongoose from "mongoose";

export const ORDER_STATUSES = [
  "Order Placed",
  "Packing",
  "Shipped",
  "Out for delivery",
  "Delivered",
];

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        image: { type: String, default: "" },
        price: { type: Number, required: true },
        size: {
          type: String,
          required: true,
          enum: ["S", "M", "L", "XL", "XXL"],
        },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    shippingAddress: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: String, required: true },
      country: { type: String, required: true },
      phone: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "razorpay"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Done", "Failed"],
      default: "Pending",
    },
    razorpayOrderId: { type: String, default: "" },
    razorpayPaymentId: { type: String, default: "" },
    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: "Order Placed",
    },
    subtotal: { type: Number, required: true },
    shippingFee: { type: Number, required: true },
    total: { type: Number, required: true },
  },
  { timestamps: true },
);

export const Order =
  mongoose.models.Order || mongoose.model("Order", orderSchema);
