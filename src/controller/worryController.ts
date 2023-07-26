import { NextFunction, Request, Response } from "express";
import { rm , sc} from "../constants";
import { success } from "../constants/response";
import statusCode from "../constants/statusCode";
import worryService from "../service/worryService";
import { worryCreateDTO, worryUpdateDTO } from "../interfaces/worryDTO";




const postWorry = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.body;
        const worryCreateDTO: worryCreateDTO = req.body;
        worryCreateDTO.userId = userId;
        // console.log(worryCreateDTO);

        const data = await worryService.postWorry(worryCreateDTO);

        return res.status(sc.OK).send(success(statusCode.OK, rm.CREATE_WORRY_SUCCESS, data));

    } catch (error) {
        next(error);
    }
};

const patchWorry = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const worryUpdateDTO: worryUpdateDTO = req.body;

        const data = await worryService.patchWorry(worryUpdateDTO);

        return res.status(sc.OK).send(success(statusCode.OK, rm.UPDATE_WORRY_SUCCESS, data));

    } catch (error) {
        next(error);
    }
};

const deleteWorry = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { worryId } = req.params;
        const { userId }= req.body;

        await worryService.deleteWorry(+worryId,userId);

        return res.status(sc.OK).send(success(statusCode.OK, rm.DELETE_WORRY_SUCCESS));

    } catch (error) {
        next(error);
    }
};

const getWorryDetail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { worryId } = req.params;
        const { userId }= req.body;

        const data = await worryService.getWorryDetail(+worryId,userId);

        return res.status(sc.OK).send(success(statusCode.OK, rm.GET_WORRY_DETAIL_SUCCESS,data));

    } catch (error) {
        next(error);
    }
};


export default{
    postWorry,
    patchWorry,
    deleteWorry,
    getWorryDetail,

}