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

router.patch("/",
    auth,
    [
        body('worryId').notEmpty().withMessage("body 에 worryId 값이 존재하지 않습니다"),
        body('title').notEmpty().withMessage("body 에 title 값이 존재하지 않습니다"),
        body('answers').notEmpty().withMessage("body 에 answers 값이 존재하지 않습니다"),
    ],
    validate,
    worryController.patchWorry,
);

router.delete("/:worryId",
    auth,
    worryController.deleteWorry,
);

router.get("/:worryId",
    auth,
    worryController.getWorryDetail,
);

router.patch("/finalAnswer",
    auth,
    [
        body('worryId').notEmpty().withMessage("body 에 worryId 값이 존재하지 않습니다"),
        body('finalAnswer').notEmpty().withMessage("body 에 finalAnswer 값이 존재하지 않습니다"),
    ],
    validate,
    worryController.patchFinalAnswer,
);

export default router;
