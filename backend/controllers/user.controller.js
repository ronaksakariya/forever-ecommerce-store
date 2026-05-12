import { User } from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import validator from "validator";
import ApiResponse from "../utils/apiResponse.js";
import { generateAndSaveTokens } from "../utils/generateTokens.js";
import {
  accessTokenCookieOptions,
  adminTokenCookieOptions,
  cookieOptions,
  refreshTokenCookieOptions,
} from "../utils/cookieOptions.js";
import jwt from "jsonwebtoken";

const addressFields = [
  "label",
  "name",
  "email",
  "phone",
  "street",
  "city",
  "state",
  "zip",
  "country",
];

const requiredAddressFields = addressFields.filter((field) => field !== "label");

const normalizeIndianPhone = (phone = "") => {
  const compactPhone = String(phone).trim().replace(/\s+/g, "");

  if (!compactPhone) return "";
  if (compactPhone.startsWith("+91")) return compactPhone;
  if (compactPhone.startsWith("91") && compactPhone.length === 12) {
    return `+${compactPhone}`;
  }

  return `+91${compactPhone.replace(/^0+/, "")}`;
};

const normalizeAddress = (payload = {}) => {
  const normalizedAddress = addressFields.reduce((address, field) => {
    address[field] = String(payload[field] || "").trim();
    return address;
  }, {});

  normalizedAddress.label = normalizedAddress.label || "Home";
  normalizedAddress.phone = normalizeIndianPhone(normalizedAddress.phone);
  normalizedAddress.zip = normalizedAddress.zip || String(payload.pincode || "").trim();
  normalizedAddress.pincode = normalizedAddress.zip;
  normalizedAddress.isDefault = Boolean(payload.isDefault);

  return normalizedAddress;
};

const validateAddress = (address) => {
  const missingField = requiredAddressFields.find((field) => !address[field]);

  if (missingField) {
    throw new ApiError(400, "all address fields are required");
  }
};

const sendUserProfile = (res, user, message) => {
  return res.status(200).json(new ApiResponse(200, { user }, message));
};

export const registerUser = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    throw new ApiError(400, "all fields are required");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "user already exists");
  }

  if (!validator.isEmail(email)) {
    throw new ApiError(422, "email is not valid");
  }
  if (password.length <= 8) {
    throw new ApiError(422, "password length should be more than 8");
  }

  const user = await User.create({ name, email, password });
  if (!user) {
    throw new ApiError(500, "something went wrong while creating user");
  }
  const createdUser = await User.findById(user._id);

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "user created successfully"));
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "all fields are required");
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new ApiError(404, "user does not exist");
  }

  const isPasswordCorrect = await user.checkPassword(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "password is incorrect");
  }

  const { accessToken, refreshToken } = await generateAndSaveTokens(user);

  user.password = undefined;

  return res
    .status(200)
    .cookie("accessToken", accessToken, accessTokenCookieOptions)
    .cookie("refreshToken", refreshToken, refreshTokenCookieOptions)
    .json(new ApiResponse(200, user, "user logged in successfully"));
});

export const getUserProfile = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new ApiError(404, "user not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "user logged in successfully"));
});

export const addAddress = asyncHandler(async (req, res) => {
  const user = req.user;
  const address = normalizeAddress(req.body);
  validateAddress(address);

  if (address.isDefault || user.address.length === 0) {
    user.address.forEach((savedAddress) => {
      savedAddress.isDefault = false;
    });
    address.isDefault = true;
  }

  user.address.push(address);
  await user.save({ validateBeforeSave: false });

  return sendUserProfile(res, user, "address saved successfully");
});

export const updateAddress = asyncHandler(async (req, res) => {
  const user = req.user;
  const { addressId } = req.params;
  const savedAddress = user.address.id(addressId);

  if (!savedAddress) {
    throw new ApiError(404, "address not found");
  }

  const nextAddress = normalizeAddress({
    ...savedAddress.toObject(),
    ...req.body,
  });
  validateAddress(nextAddress);

  if (nextAddress.isDefault) {
    user.address.forEach((address) => {
      address.isDefault = address.id === addressId;
    });
  } else if (savedAddress.isDefault) {
    nextAddress.isDefault = true;
  }

  Object.assign(savedAddress, nextAddress);
  await user.save({ validateBeforeSave: false });

  return sendUserProfile(res, user, "address updated successfully");
});

export const deleteAddress = asyncHandler(async (req, res) => {
  const user = req.user;
  const { addressId } = req.params;
  const savedAddress = user.address.id(addressId);

  if (!savedAddress) {
    throw new ApiError(404, "address not found");
  }

  const wasDefault = savedAddress.isDefault;
  user.address.pull(addressId);

  if (wasDefault && user.address.length > 0) {
    user.address[0].isDefault = true;
  }

  await user.save({ validateBeforeSave: false });

  return sendUserProfile(res, user, "address deleted successfully");
});

export const setDefaultAddress = asyncHandler(async (req, res) => {
  const user = req.user;
  const { addressId } = req.params;
  const savedAddress = user.address.id(addressId);

  if (!savedAddress) {
    throw new ApiError(404, "address not found");
  }

  user.address.forEach((address) => {
    address.isDefault = address.id === addressId;
  });

  await user.save({ validateBeforeSave: false });

  return sendUserProfile(res, user, "default address updated successfully");
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "user not authenticated");
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );
  } catch (error) {
    throw new ApiError(401, "Refresh token expired or invalid");
  }

  const user = await User.findById(decodedToken.id).select("+refreshToken");

  if (!user) {
    throw new ApiError(401, "Invalid refresh token");
  }

  if (user?.refreshToken !== incomingRefreshToken) {
    throw new ApiError(
      401,
      "Refresh token has already been used or is invalid",
    );
  }

  const { accessToken, refreshToken } = await generateAndSaveTokens(user);

  return res
    .status(200)
    .cookie("accessToken", accessToken, accessTokenCookieOptions)
    .cookie("refreshToken", refreshToken, refreshTokenCookieOptions)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken },
        "access token refreshed successfully",
      ),
    );
});

export const logoutUser = asyncHandler(async (req, res) => {
  const user = req.user;

  await User.findByIdAndUpdate(user._id, { $unset: { refreshToken: 1 } });

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

export const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "admin email and password are necessary");
  }

  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    throw new ApiError(401, "admin credentials are incorrect");
  }

  const adminToken = await jwt.sign(
    { email, role: "admin" },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ADMIN_TOKEN_EXPIRY },
  );

  return res
    .status(200)
    .cookie("adminToken", adminToken, adminTokenCookieOptions)
    .json(new ApiResponse(200, { adminToken }, "admin logged in successfully"));
});

export const adminLogout = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .clearCookie("adminToken", adminTokenCookieOptions)
    .json(new ApiResponse(200, {}, "admin logged out successfully"));
});

export const verifyAdmin = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, {}, "admin authorized"));
});
