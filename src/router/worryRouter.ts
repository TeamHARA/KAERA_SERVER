import { Router } from "express";
import { auth } from "../middlewares";
import worryController from "../controller/worryController";
import validate from "../middlewares/validate";
import { body } from "express-validator";

const router = Router();

router.post("/",
    auth,
    [
        body('templateId').notEmpty().withMessage("body 에 templateId 값이 존재하지 않습니다"),
        body('title').notEmpty().withMessage("body 에 title 값이 존재하지 않습니다"),
        body('answers').notEmpty().withMessage("body 에 answers 값이 존재하지 않습니다"),
        body('deadline').notEmpty().withMessage("body 에 deadline 값이 존재하지 않습니다"),
    ],
    validate,
    worryController.postWorry,
);

// router.path("/",
//     [
//         param('templateId').isInt().withMessage("필요한 Param 값이 없습니다."),
//     ],
//     validate,
//     worryController.patchWorry
// );
export default router;
