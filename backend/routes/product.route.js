import { Router } from "express";
import {
  addProduct,
  getProduct,
  listProducts,
  removeProduct,
} from "../controllers/product.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/add-product").post(upload.array("images", 5), addProduct);
router.route("/list-products").get(listProducts);
router.route("/remove-product").post(removeProduct);
router.route("/get-product").get(getProduct);

export default router;
