import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDatabase } from "./config/database.js";

const app = express();
const port = process.env.PORT;

connectDatabase();

app.use(
  cors({
    origin: process.env.CLIENT_URL || `http://localhost:${port}`,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.listen(port, () => {
  console.log("server is running on port :", port);
});

app.get("/", (req, res) => res.send("API working"));
