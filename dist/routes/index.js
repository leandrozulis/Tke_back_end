import userRouter from "./userRouter.js";
import productRouter from "./productRouter.js";
import productImageRouter from "./productImageRouter.js";
const router = (app) => {
    app.use("/", userRouter);
    app.use("/", productRouter);
    app.use("/", productImageRouter);
};
export default router;
