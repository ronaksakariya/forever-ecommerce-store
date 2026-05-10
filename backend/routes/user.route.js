import { Router } from "express";
import {
  addAddress,
  adminLogin,
  adminLogout,
  deleteAddress,
  getUserProfile,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  setDefaultAddress,
  updateAddress,
  verifyAdmin,
} from "../controllers/user.controller.js";
import { adminAuth } from "../middlewares/adminAuth.js";
import { verifyJWT } from "../middlewares/userAuth.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/verify-user").get(verifyJWT, getUserProfile);
router.route("/profile").get(verifyJWT, getUserProfile);
router.route("/addresses").post(verifyJWT, addAddress);
router
  .route("/addresses/:addressId")
  .patch(verifyJWT, updateAddress)
  .delete(verifyJWT, deleteAddress);
router
  .route("/addresses/:addressId/default")
  .patch(verifyJWT, setDefaultAddress);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/logout").post(verifyJWT, logoutUser);

router.route("/admin-login").post(adminLogin);
router.route("/admin-logout").post(adminLogout);
router.route("/verify-admin").get(adminAuth, verifyAdmin);

export default router;
