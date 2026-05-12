import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandler.js";
import { connectDatabase } from "./config/database.js";

const app = express();
const port = process.env.PORT || 8000;

const defaultOrigins = ["http://localhost:5173", "http://localhost:5174"];
const configuredOrigins = [
  process.env.CLIENT_URL,
  process.env.ADMIN_URL,
  ...(process.env.ALLOWED_ORIGINS || "").split(","),
]
  .map((origin) => origin?.trim())
  .filter(Boolean);

const allowedOrigins = [...new Set([...defaultOrigins, ...configuredOrigins])];

connectDatabase();

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
import userRouter from "./routes/user.route.js";
import productRouter from "./routes/product.route.js";
import cartRouter from "./routes/cart.route.js";
import orderRouter from "./routes/order.route.js";

app.get("/", (req, res) => {
  res.status(200).json({ status: "ok", service: "forever-ecomm-backend" });
});
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", service: "forever-ecomm-backend" });
});

app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use(errorHandler);

app.listen(port, () => {
  console.log("server is running on port :", port);
});
