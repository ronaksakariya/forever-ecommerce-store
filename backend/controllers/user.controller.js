import { User } from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import validator from "validator";
import ApiResponse from "../utils/apiResponse.js";

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
