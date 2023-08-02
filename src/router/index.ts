import { Router } from "express";
import userRouter from './userRouter';
import templateRouter from "./templateRouter";
import worryRouter from "./worryRouter";
import reviewRouter from "./reviewRouter";

const router: Router = Router();

router.use("/user", userRouter);
router.use("/template",templateRouter);
router.use("/worry",worryRouter);
router.use("/review",reviewRouter);


export default router;
