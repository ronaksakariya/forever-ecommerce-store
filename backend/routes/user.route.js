import { Router } from "express";
import {
  adminLogin,
  adminLogout,
  getUserProfile,
  loginUser,
  refreshAccessToken,
  registerUser,
  verifyAdmin,
} from "../controllers/user.controller.js";
import { adminAuth } from "../middlewares/adminAuth.js";
import { verifyJWT } from "../middlewares/userAuth.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/verify-user").get(verifyJWT, getUserProfile);
router.route("/refresh-token").post(refreshAccessToken);

router.route("/admin-login").post(adminLogin);
router.route("/admin-logout").post(adminLogout);
router.route("/verify-admin").get(adminAuth, verifyAdmin);

export default router;
