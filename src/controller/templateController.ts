import { NextFunction, Request, Response } from "express";
import { rm, sc } from "../constants";
import templateService from "../service/templateService";
import { success } from "../constants/response";
import statusCode from "../constants/statusCode";


const getTemplateById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { templateId } = req.params;

        const data = await templateService.getTemplateById(+templateId);

        return res.status(sc.OK).send(success(statusCode.OK, rm.READ_TEMPLATE_SUCCESS, data));

    } catch (error) {
        next(error);
    }
};

export default{
    getTemplateById,
    
}