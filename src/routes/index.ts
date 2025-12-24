import express from "express";
import userRouter from "./userRouter";
import productRouter from "./productRouter";
import productImageRouter from "./productImageRouter";

const router = (app: express.Router) => {
  app.use("/", userRouter);
  app.use("/", productRouter);
  app.use("/", productImageRouter);
}

export default router;