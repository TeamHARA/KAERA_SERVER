import { NextFunction, Request, Response } from "express";
import { fail, success } from "../constants/response";
import { rm, sc } from "../constants";
import { ClientException } from "../common/error/exceptions/customExceptions";
import statusCode from "../constants/statusCode";
import { userService } from "../service";
import { userCreateDTO } from "../interfaces/DTO/userDTO";
import { validationResult } from "express-validator";
import jwtHandler from "../modules/jwtHandler";
import axios from 'axios';
import qs from "qs";

const kakaoLogin_getAuthorizedCode = async (req: Request, res: Response, next: NextFunction) => {
  try{
    //인가코드 받기
    const baseUrl = "https://kauth.kakao.com/oauth/authorize";
    const config = {
      client_id: process.env.KAKAO_CLIENT_ID!,
      redirect_uri: process.env.KAKAO_REDIRECT_URI!,
      response_type: "code",
    };
    const params = new URLSearchParams(config).toString();

    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
  
  }catch (error) {
    next(error);
  }

};
const kakaoLogin_getToken = async (req: Request, res: Response, next: NextFunction) => {
  try{

    if(req.query.error){
      throw new ClientException("로그인 실패");
    }

    //토큰 받기
    const response = await axios({
        method: 'POST',
        url: 'https://kauth.kakao.com/oauth/token',
        headers:{
          'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
        data:qs.stringify({//객체를 string 으로 변환
            grant_type: 'authorization_code',             //해당 값으로 고정
            client_id:process.env.KAKAO_CLIENT_ID,
            client_secret:process.env.KAKAO_SECRET_KEY,  //보안 강화를 위함 (필수값은 아님)
            redirectUri:process.env.KAKAO_REDIRECT_URI,
            code:req.query.code,                         //kakaoLogin_getAuthorizeCode 를 통해 query string 으로 받은 인가 코드
        })
    })
    const token = response.data
    const user = await kakaoLogin_getUserKakaoInfo(token);
    if(!user)
      return res.redirect('/kakao/login');
    
    const { id, properties } = user;
    console.log(id, properties.nickname)
    

    // return res.status(sc.OK).send(success(statusCode.OK, rm.KAKAO_LOGIN_SUCCESS, response.data));


  } catch (error) {
    next(error);
}
}

const kakaoLogin_getUserKakaoInfo =async (token: any) => {
      
  // 엑세스 토큰을 제대로 전달받은 경우
    if ("access_token" in token) {
      const { access_token } = token;
      // console.log(access_token);
      const response = await axios({
        method: 'GET',
        url: 'https://kapi.kakao.com/v2/user/me',
        headers:{
          'Authorization': `Bearer ${access_token}`,
          'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
      })
      return response.data;
    } 
    // 엑세스 토큰이 없으면 로그인페이지로 리다이렉트
    else {
      return null;
    }

}

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
    kakaoLogin_getAuthorizedCode,
    kakaoLogin_getToken
}