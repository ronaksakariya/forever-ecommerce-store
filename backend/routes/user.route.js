import { Router } from "express";
import {
  adminLogin,
  loginUser,
  registerUser,
} from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/admin-login").post(adminLogin);

export default router;
