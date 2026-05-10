import { Router } from "express";
import { verifyJWT } from "../middlewares/userAuth.js";
import { syncCart } from "../controllers/cart.controller.js";

const router = Router();

router.route("/update").post(verifyJWT, syncCart);

export default router;
