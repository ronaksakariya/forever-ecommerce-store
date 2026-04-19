import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
    refreshToken: {
      type: String,
      default: null,
      select: false,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.generateAccessToken = function () {
  return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
  });
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRE,
  });
};

export const User = mongoose.models.User || mongoose.model("User", userSchema);
