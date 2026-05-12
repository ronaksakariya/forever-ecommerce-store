import { Router } from "express";

import {
  getAdminOrders,
  getMyOrders,
  placeOrder,
  createRazorpayOrder,
  verifyRazorpayPayment,
  updateOrderStatus,
} from "../controllers/order.controller.js";
import { adminAuth } from "../middlewares/adminAuth.js";
import { verifyJWT } from "../middlewares/userAuth.js";

const router = Router();

router.route("/place").post(verifyJWT, placeOrder);
router.route("/razorpay/create").post(verifyJWT, createRazorpayOrder);
router.route("/razorpay/verify").post(verifyJWT, verifyRazorpayPayment);
router.route("/my-orders").get(verifyJWT, getMyOrders);
router.route("/admin/orders").get(adminAuth, getAdminOrders);
router
  .route("/admin/orders/:orderId/status")
  .patch(adminAuth, updateOrderStatus);

export default router;
