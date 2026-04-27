import { User } from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import validator from "validator";
import ApiResponse from "../utils/apiResponse.js";
import { generateAndSaveTokens } from "../utils/generateTokens.js";
import {
  accessTokenCookieOptions,
  adminTokenCookieOptions,
  refreshTokenCookieOptions,
} from "../utils/cookieOptions.js";
import jwt from "jsonwebtoken";

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
    throw new ApiError(409, "all fields are required");
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new ApiError(409, "user does not exist");
  }

  const isPasswordCorrect = await user.checkPassword(password);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "password is incorrect");
  }

  const { accessToken, refreshToken } = await generateAndSaveTokens(user);

  user.password = undefined;
  console.log(user);

  return res
    .status(200)
    .cookie("accessToken", accessToken, accessTokenCookieOptions)
    .cookie("refreshToken", refreshToken, refreshTokenCookieOptions)
    .json(new ApiResponse(200, user, "user logged in successfully"));
});

export const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "admin email and password are necessary");
  }

  if (
    email !== process.env.ADMIN_EMAIL &&
    password !== process.env.ADMIN_PASSWORD
  ) {
    throw new ApiError(409, "admin credentials are incorrect");
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
