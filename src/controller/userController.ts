import { NextFunction, Request, Response } from "express";
import { fail, success } from "../constants/response";
import { rm, sc } from "../constants";
import { ClientException } from "../common/error/exceptions/customExceptions";
import statusCode from "../constants/statusCode";
import { userService } from "../service";
import { userCreateDTO } from "../interfaces/DTO/userDTO";
import { validationResult } from "express-validator";
import jwtHandler from "../modules/jwtHandler";

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;

        // if (!userId) {
        //     throw new ClientException("필요한 Param 값이 없습니다.");
        // }
        const foundUser = await userService.getUserById(+userId);

        return res.status(sc.OK).send(success(statusCode.OK, rm.READ_USER_SUCCESS, foundUser));

    } catch (error) {
        next(error);
    }
};

//* 유저 생성
const createUser = async (req: Request, res: Response) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
    }
  
    const userCreateDto: userCreateDTO = req.body;
    const data = await userService.createUser(userCreateDto);
  
    if (!data) {
      return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.SIGNUP_FAIL));
    }
  
    // ================== 여기 추가 ========================
    //? 아까 만든 jwtHandler 내 sign 함수를 이용해 accessToken 생성
    const accessToken = jwtHandler.sign(data.id);
  
    const result = {
      id: data.id,
      name: data.name,
      accessToken,
    };
  
    return res.status(sc.CREATED).send(success(sc.CREATED, rm.SIGNUP_SUCCESS, result));
  };


export default{
    getUserById,
    createUser,
}