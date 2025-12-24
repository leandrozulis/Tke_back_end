import express from "express";
import userRouter from "./userRouter.js";
import productRouter from "./productRouter.js";
import productImageRouter from "./productImageRouter.js";

const router = (app: express.Router) => {
  app.use("/", userRouter);
  app.use("/", productRouter);
  app.use("/", productImageRouter);
}

export default router;