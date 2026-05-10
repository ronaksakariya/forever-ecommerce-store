import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const syncCart = asyncHandler(async (req, res) => {
  const { cartItems } = req.body;
  const user = req.user;

  if (!cartItems) {
    throw new ApiError(400, "cart items required");
  }

  const formattedCartItem = cartItems.map((item) => ({
    product: item.productId,
    size: item.size,
    quantity: item.quantity,
  }));

  user.cartData = formattedCartItem;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(
      new ApiResponse(200, user.cartData, "cart items updated successfully"),
    );
});
