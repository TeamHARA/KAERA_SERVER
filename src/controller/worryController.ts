import { NextFunction, Request, Response } from "express";
import { rm , sc} from "../constants";
import { success } from "../constants/response";
import statusCode from "../constants/statusCode";
import worryService from "../service/worryService";
import { worryCreateDTO } from "../interfaces/worryDTO";




const postWorry = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.body;
        const worryCreateDTO: worryCreateDTO = req.body;
        worryCreateDTO.userId = userId;

        const data = await worryService.postWorry(worryCreateDTO);

        return res.status(sc.OK).send(success(statusCode.OK, rm.CREATE_WORRY_SUCCESS, data));

    } catch (error) {
        next(error);
    }
};

export default{
    postWorry,
    
}