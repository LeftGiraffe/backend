import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import events from "events";

import authRoutes from "./src/routes/auth.routes.js";
import stepRoutes from "./src/routes/step.routes.js";

import connectToMongoDB from "./src/db/connectToMongoDB.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

events.EventEmitter.defaultMaxListeners = 20;

const app = express();

// 보안
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/steps", stepRoutes);

app.listen(PORT, () => {
  connectToMongoDB();
  console.log(`server Running on ${PORT}`);
});
