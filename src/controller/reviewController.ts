import { NextFunction, Request, Response } from "express";
import { rm, sc } from "../constants";
import { success } from "../constants/response";
import statusCode from "../constants/statusCode";
import { reviewDTO } from "../interfaces/DTO/reviewDTO"
import reviewService from "../service/reviewService";


const patchReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reviewDTO: reviewDTO = req.body;
        const data = await reviewService.patchReview(reviewDTO);

        let message;
        if (data.isNew)
            message = rm.CREATE_REVIEW_SUCCESS
        else
            message = rm.UPDATE_REVIEW_SUCCESS


        return res.status(sc.OK).send(success(statusCode.OK, message, data.result));

    } catch (error) {
        next(error);
    }
}


export default {
    patchReview
}