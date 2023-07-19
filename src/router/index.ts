import { Router } from "express";
import userRouter from './userRouter';
import templateRouter from "./templateRouter";

const router: Router = Router();

router.use("/user", userRouter);
router.use("/template",templateRouter);

export default router;
