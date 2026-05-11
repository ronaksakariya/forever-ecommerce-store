import { Router } from "express";
import {
  addProduct,
  getProduct,
  listProducts,
  removeProduct,
  updateProduct,
} from "../controllers/product.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { adminAuth } from "../middlewares/adminAuth.js";

const router = Router();

router
  .route("/add-product")
  .post(adminAuth, upload.array("images", 5), addProduct);
router.route("/list-products").get(adminAuth, listProducts);
router.route("/list").get(listProducts);
router.route("/remove-product").post(adminAuth, removeProduct);
router.route("/get-product").get(adminAuth, getProduct);
router.route("/:id").get(adminAuth, getProduct).patch(adminAuth, updateProduct);

export default router;
