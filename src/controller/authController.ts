import { NextFunction, Request, Response } from "express";
import { rm, sc } from "../constants";
import { fail, success } from "../constants/response";
import statusCode from "../constants/statusCode";
import axios from 'axios';
import qs from "qs";
import authService from "../service/authService";


// 서버에서 테스트용 카카오 토큰을 받기 위해 쓰일, 인가코드를 받기 위한 함수
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

  // 서버에서 테스트용 카카오 토큰을 받기 위한 함수
  const kakaoLogin_getToken = async (req: Request, res: Response, next: NextFunction) => {
    try{
  
      if(req.query.error){
        res.status(sc.BAD_REQUEST).send(fail(statusCode.BAD_REQUEST, rm.READ_KAKAO_TOKEN_FAIL));
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
  
      return res.status(sc.OK).send(success(statusCode.OK, rm.READ_KAKAO_TOKEN_SUCCESS, response.data));
  
      //발급받은 토큰을 사용해서 카카오 유저 정보 가져오기
      // const user = await kakaoLogin_getUserKakaoInfo(token);
      // if(!user)
      //   return res.redirect('/kakao/login');
      
      // return await serviceLogin(req,res,next,user);
  
      // // return res.status(sc.OK).send(success(statusCode.OK, rm.KAKAO_LOGIN_SUCCESS, response.data));
  
  
    } catch (error) {
      next(error);
  }
  }
  
  
  const kakaoLogin =async (req: Request, res:Response, next:NextFunction) => {
    try{
      const { accessToken } = req.body;
  
      // get user kakao info
      const response = await axios({
        method: 'GET',
        url: 'https://kapi.kakao.com/v2/user/me',
        headers:{
          'Authorization': `Bearer ${accessToken}`,
          'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
      })
  

      const data = await authService.serviceLogin("kakao", response.data);


      // 경우에 따라 다른 response message 출력
      // - 회원가입한 경우
      if(data.isNew){
        return res.status(sc.OK).send(success(sc.OK, rm.SIGNUP_SUCCESS, data.result));
      }
  
      // - 기존회원이 로그인한 경우
      return res.status(sc.OK).send(success(sc.OK, rm.LOGIN_SUCCESS, data.result));
  
    }catch(error:any){
      console.log(error)

      //토큰이 유효하지 않은 경우
      if(error.response.data.msg == "this access token does not exist"){
        return res.status(sc.UNAUTHORIZED).send(fail(sc.UNAUTHORIZED, rm.INVALID_TOKEN));
      }
      return res.status(error.response.status).send(fail(error.response.status, error.response.data.msg));
  
    }
  
  }
  
  const kakaoLogout =async (req: Request, res:Response, next:NextFunction) => {
    try{
      const { accessToken } = req.body;
  
      const response = await axios({
        method: 'POST',
        url: 'https://kapi.kakao.com/v1/user/logout',
        headers:{
          'Authorization': `Bearer ${accessToken}`,
        }
      })
  
      return res.status(sc.OK).send(success(statusCode.OK, rm.KAKAO_LOGOUT_SUCCESS, response.data.msg));
  
    }catch(error:any){
  
      //토큰이 유효하지 않은 경우
      if(error.response.data.msg == "this access token does not exist"){
        return res.status(sc.UNAUTHORIZED).send(fail(sc.UNAUTHORIZED, rm.INVALID_TOKEN));
      }
      console.log(error)
  
      return res.status(error.response.status).send(fail(error.response.status, error.response.data.msg));
  
    }
  
  }


  const appleLogin =async (req: Request, res:Response, next:NextFunction) => {
    try {
      const { identityToken, user, fullName } = req.body
      const DTO = {
        identityToken: identityToken,
        id: user,
        fullName: fullName
      }
      const data = await authService.serviceLogin("apple", DTO);

    
      // - 회원가입한 경우
      if(data.isNew){
        return res.status(sc.OK).send(success(sc.OK, rm.SIGNUP_SUCCESS, data.result));
      }

      // - 기존회원이 로그인한 경우
      return res.status(sc.OK).send(success(sc.OK, rm.LOGIN_SUCCESS, data.result));  
    
  
  } catch (err) {
     console.log("Err", err)
  }
  
  }
  

  
export default{
    kakaoLogin_getAuthorizedCode,
    kakaoLogin_getToken,
    kakaoLogin,
    kakaoLogout,
    appleLogin,

}