import { NextFunction, Request, Response } from "express";
import { fail, success } from "../constants/response";
import { rm, sc } from "../constants";
import { userService } from "../service";
import statusCode from "../constants/statusCode";


const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;

        const foundUser = await userService.getUserById(+userId);
        return res.status(sc.OK).send(success(statusCode.OK, rm.READ_USER_SUCCESS, foundUser));

    } catch (error) {
        next(error);
    }
};


export default {
    getUserById,

}