import { NextFunction, Request, Response } from "express";
import { rm, sc } from "../constants";
import { fail, success } from "../constants/response";
import userService from "./userService";
import jwtHandler from "../modules/jwtHandler";
import tokenRepository from "../repository/tokenRepository";


  // 캐라 서비스의 로그인 함수
  const serviceLogin = async (req: Request, res:Response,next:NextFunction, user:any) => {
    try{
      const { id, kakao_account } = user;
  
      let isNew = false
      let foundUser = await userService.getUserByKakaoId(id);
  
      //가입하지 않은 회원일 경우, 회원가입 진행
      if(!foundUser){
        //필수 동의만 했을 경우
        req.body = {
          "kakaoId": id,
          "name": kakao_account.profile.nickname,
        }
        //선택 동의도 했을 경우
        if(kakao_account.email)
          req.body.email = kakao_account.email
        if(kakao_account.age_range)
          req.body.ageRange = kakao_account.age_range
        if(kakao_account.gender)
          req.body.gender = kakao_account.gender
  
        const createdUser = await userService.createUser(req.body);
        foundUser = createdUser
        isNew = true
      }
  
  
      //local accessToken, refreshToken 발급
      const accessToken = jwtHandler.access(foundUser.id);
      const refreshToken = jwtHandler.refresh();
  
      const result = {
        id: foundUser.id,
        name: foundUser.name,
        accessToken,
        refreshToken
      };
  
      // 발급받은 refresh token 은 DB에 저장
      const data = await tokenRepository.findRefreshTokenById(foundUser.id);
      if(!data){
        await tokenRepository.createRefreshToken(foundUser.id, refreshToken);
      }
      await tokenRepository.updateRefreshTokenById(foundUser.id,refreshToken);
  
  
  
      // 경우에 따라 다른 response message 출력
      // - 회원가입한 경우
      if(isNew){
        return res.status(sc.OK).send(success(sc.OK, rm.SIGNUP_SUCCESS, result));
      }
  
      // - 기존회원이 로그인한 경우
      return res.status(sc.OK).send(success(sc.OK, rm.LOGIN_SUCCESS, result));
  
    }catch(error){
      next(error)
    }
  
  }

  export default{
    serviceLogin,

}