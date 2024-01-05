import { NextFunction, Request, Response } from "express";
import { rm, sc, tokenType } from "../constants";
import { fail, success } from "../constants/response";
import statusCode from "../constants/statusCode";
import jwtHandler from "../modules/jwtHandler";
import tokenService from "../service/tokenService";
import jwt, { JwtPayload } from "jsonwebtoken";



const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try{
      const { accessToken, refreshToken} = req.body;
      const access_decoded = jwtHandler.accessVerify(accessToken);
      const refresh_decoded = jwtHandler.refreshVerify(refreshToken);
      const access_decoded_without_verification = jwt.decode(accessToken);
      const userId: number = (access_decoded_without_verification as JwtPayload).userId

  
      // 잘못된 accessToken or refreshToken 일 경우
      if ((access_decoded === tokenType.ACCESS_TOKEN_INVALID) || (refresh_decoded === tokenType.REFRESH_TOKEN_INVALID))
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.INVALID_TOKEN));
  
      // 기간이 만료된 경우 -> refreshToken을 이용하여 accessToken 재발급
      if (access_decoded === tokenType.ACCESS_TOKEN_EXPIRED){
        // refresh token도 만료된 경우 (access,refresh 모두 만료)
        if (refresh_decoded === tokenType.REFRESH_TOKEN_EXPIRED)
          return res.status(sc.UNAUTHORIZED).send(fail(sc.UNAUTHORIZED, rm.EXPIRED_ALL_TOKEN));
        
        const new_access_token = await tokenService.refreshAccessToken(userId, refreshToken);
        return res.status(sc.OK).send(success(statusCode.OK, rm.REFRESH_TOKEN_SUCCESS, new_access_token));
  
      }
      
      // 기간이 만료되지 않은 경우 -> 기존 accessToken 다시 반환
      const data = {
        "accessToken": accessToken
      }
  
      return res.status(sc.OK).send(success(statusCode.OK, "유효한 토큰입니다. 재발급이 불필요합니다.",data));
  
    }catch(error){
      next(error)
    }
  
  }

  export default{
    refreshToken
}

