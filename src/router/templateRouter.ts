import { Router } from "express";
import { userController } from "../controller";
import { auth, validation } from "../middlewares";
import { param,body } from "express-validator";
import validate from "../middlewares/validate";
import { error } from "console";
import templateController from "../controller/templateController";


const router = Router();

router.get("/:templateId",
    [
        param('templateId').notEmpty().withMessage("필요한 Param 값이 없습니다."),
    ],
    validate,
    templateController.getTemplateById
);


export default router;