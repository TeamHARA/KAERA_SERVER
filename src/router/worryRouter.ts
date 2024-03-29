import { Router,Request } from "express";
import { auth } from "../middlewares";
import worryController from "../controller/worryController";
import validate from "../middlewares/validate";
import { body,query } from "express-validator";
import { validateBody } from "../middlewares/validateDTO";
import { worryCreateDTO, worryUpdateDTO,finalAnswerCreateDTO,deadlineUpdateDTO } from "../interfaces/DTO/worryDTO";
import alarmController from "../controller/alarmController";

const router = Router();

router.post("/",
    auth,
    [
        body('templateId').notEmpty().withMessage("body 에 'templateId' 값이 존재하지 않습니다"),
        body('title').notEmpty().withMessage("body 에 'title' 값이 존재하지 않습니다"),
        body('answers').notEmpty().withMessage("body 에 'answers' 값이 존재하지 않습니다"),
        body('deadline').notEmpty().withMessage("body 에 'deadline' 값이 존재하지 않습니다"),
    ],
    validate,
    validateBody(worryCreateDTO),
    worryController.postWorry,
);

router.patch("/",
    auth,
    [
        body('worryId').notEmpty().withMessage("body 에 'worryId' 값이 존재하지 않습니다"),
        body('title').notEmpty().withMessage("body 에 'title' 값이 존재하지 않습니다"),
        body('answers').notEmpty().withMessage("body 에 'answers' 값이 존재하지 않습니다"),
    ],
    validate,
    validateBody(worryUpdateDTO),

    worryController.patchWorry,
);

router.get("/",
    auth,
    [
        query('templateId').notEmpty().withMessage("query string 에 'templateId' 값이 존재하지 않습니다")
    ],
    validate,
    worryController.getWorryListByTemplate,
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
        body('worryId').notEmpty().withMessage("body 에 'worryId' 값이 존재하지 않습니다"),
        body('finalAnswer').notEmpty().withMessage("body 에 'finalAnswer' 값이 존재하지 않습니다"),
    ],
    validate,
    validateBody(finalAnswerCreateDTO),
    worryController.patchFinalAnswer,
    alarmController.setFinishedAlarm
);

router.patch("/deadline",
    auth,
    [
        body('worryId').notEmpty().withMessage("body 에 'worryId' 값이 존재하지 않습니다"),
        body('dayCount').notEmpty().withMessage("body 에 'dayCount' 값이 존재하지 않습니다"),
    ],
    validate,
    validateBody(deadlineUpdateDTO),
    worryController.patchDeadline,
);



// router.get("/list/:isSolved",
//     auth,
//     validate,
//     worryController.getWorryList,
// );

router.get("/:isSolved/list",
auth,
[
    query('page').notEmpty().withMessage("query string 에 'page' 값이 존재하지 않습니다"),
    query('limit').notEmpty().withMessage("query string 에 'limit' 값이 존재하지 않습니다")
],
validate,
worryController.getWorryList,
);



export default router;
