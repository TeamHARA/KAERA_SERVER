import { NextFunction, Request, Response } from "express";
import { validationResult, matchedData } from 'express-validator';
import { ClientException } from "../common/error/exceptions/customExceptions";
import { rm, sc } from "../constants";
import { fail, success } from "../constants/response";


export default async (req: Request, res: Response, next: NextFunction) => {
   
    const error = validationResult(req);
    // console.log(error);
    // console.log(data);
    if (!error.isEmpty()) {
      return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, error.array()[0].msg));
    }

    // validated 된 data만 object로 만든 것
    // req.body = matchedData(req),

    next();

}