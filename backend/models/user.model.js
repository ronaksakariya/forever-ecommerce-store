import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "user name is required filed"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "user email is required filed"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "user password is required filed"],
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    address: {
      label: { type: String, default: "Home" },
      name: String,
      phone: String,
      street: String,
      city: String,
      state: String,
      pincode: String,
      isDefault: { type: Boolean, default: true },
    },
    cartData: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        size: {
          type: String,
          required: true,
          enum: ["S", "M", "L", "XL", "XXL"],
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
          min: [1, "Quantity cannot be less than 1"],
        },
      },
    ],
  },
  { timestamps: true },
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
