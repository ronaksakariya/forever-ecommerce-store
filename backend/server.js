import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandler.js";
import { connectDatabase } from "./config/database.js";

const app = express();
const port = process.env.PORT;

connectDatabase();

app.use(
  cors({
    origin: [
      process.env.CLIENT_URL || "http://localhost:5173",
      process.env.ADMIN_URL || "http://localhost:5174",
    ],
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
import userRouter from "./routes/user.route.js";
import productRouter from "./routes/product.route.js";

app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use(errorHandler);

app.listen(port, () => {
  console.log("server is running on port :", port);
});
