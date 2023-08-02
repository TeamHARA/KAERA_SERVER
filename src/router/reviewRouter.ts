import { body } from 'express-validator';
import { Router } from "express";
import  reviewController  from '../controller/reviewController'
import { auth } from "../middlewares";
import validate from "../middlewares/validate";




const router = Router();

router.put("/",
    auth,
    [
        body('worryId').notEmpty().withMessage("body 에 worryId 값이 존재하지 않습니다"),
        body('review').notEmpty().withMessage("body 에 review 값이 존재하지 않습니다"),
    ],
    validate,
    reviewController.putReview
);



export default router;