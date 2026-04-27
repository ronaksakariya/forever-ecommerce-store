import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const adminAuth = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.adminToken ||
    req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "admin not authorized");
  }

  const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  if (decodedToken.role !== "admin") {
    throw new ApiError(403, "invalid token, access denied");
  }

  req.admin = decodedToken;
  next();
});
