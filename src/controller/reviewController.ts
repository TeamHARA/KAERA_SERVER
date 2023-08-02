import { NextFunction, Request, Response } from "express";
import { rm, sc } from "../constants";
import { success } from "../constants/response";
import statusCode from "../constants/statusCode";
import { reviewDTO } from "../interfaces/DTO/reviewDTO"
import reviewService from "../service/reviewService";

const putReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reviewDTO: reviewDTO = req.body;
        const data = await reviewService.putReview(reviewDTO);
        let message = null;
        if(!data)
            message = rm.CREATE_REVIEW_SUCCESS
        else
            message = rm.UPDATE_REVIEW_SUCCESS


        return res.status(sc.OK).send(success(statusCode.OK, message, data));

    } catch (error) {
        next(error);
    }
};

export default{
    putReview
}