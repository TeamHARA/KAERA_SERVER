import { isDefined } from 'class-validator';
import { body } from 'express-validator';
import { Router } from "express";
import  reviewController  from '../controller/reviewController'
import { auth } from "../middlewares";
import validate from "../middlewares/validate";
import { validateBody } from '../middlewares/validateDTO';
import { reviewDTO } from '../interfaces/DTO/reviewDTO';




const router = Router();

router.put("/",
    auth,
    validateBody(reviewDTO),
    reviewController.putReview
);



export default router;