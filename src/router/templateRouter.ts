import { Router } from "express";
import { auth, validation } from "../middlewares";
import { param,body } from "express-validator";
import validate from "../middlewares/validate";
import templateController from "../controller/templateController";


const router = Router();

router.get("/",
    // auth,
    templateController.getAllTemplate
);

router.get("/:templateId",
    [
        param('templateId').isInt().withMessage("필요한 Param 값이 없습니다."),
    ],
    validate,
    templateController.getTemplateById
);




export default router;