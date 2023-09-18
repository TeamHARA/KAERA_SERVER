import { NextFunction, Request, Response } from "express";
import { fail, success } from "../constants/response";
import { rm, sc, tokenType } from "../constants";
import { ClientException } from "../common/error/exceptions/customExceptions";
import statusCode from "../constants/statusCode";
import { userService } from "../service";
import { userCreateDTO } from "../interfaces/DTO/userDTO";
import { validationResult } from "express-validator";
import jwtHandler from "../modules/jwtHandler";
import axios from 'axios';
import tokenRepository from "../repository/tokenRepository";
import { JwtPayload } from "jsonwebtoken";


// const kakaoLogin_getAuthorizedCode = async (req: Request, res: Response, next: NextFunction) => {
//   try{
//     //인가코드 받기
//     const baseUrl = "https://kauth.kakao.com/oauth/authorize";
//     const config = {
//       client_id: process.env.KAKAO_CLIENT_ID!,
//       redirect_uri: process.env.KAKAO_REDIRECT_URI!,
//       response_type: "code",
//     };
//     const params = new URLSearchParams(config).toString();

//     const finalUrl = `${baseUrl}?${params}`;
//     return res.redirect(finalUrl);
  
//   }catch (error) {
//     next(error);
//   }

// };
// const kakaoLogin_getToken = async (req: Request, res: Response, next: NextFunction) => {
//   try{

//     if(req.query.error){
//       throw new ClientException("로그인 실패");
//     }

//     //토큰 받기
//     const response = await axios({
//         method: 'POST',
//         url: 'https://kauth.kakao.com/oauth/token',
//         headers:{
//           'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
//         },
//         data:qs.stringify({//객체를 string 으로 변환
//             grant_type: 'authorization_code',             //해당 값으로 고정
//             client_id:process.env.KAKAO_CLIENT_ID,
//             client_secret:process.env.KAKAO_SECRET_KEY,  //보안 강화를 위함 (필수값은 아님)
//             redirectUri:process.env.KAKAO_REDIRECT_URI,
//             code:req.query.code,                         //kakaoLogin_getAuthorizeCode 를 통해 query string 으로 받은 인가 코드
//         })
//     })
//     const token = response.data
//     console.log(token)
    

//     //발급받은 토큰을 사용해서 카카오 유저 정보 가져오기
//     const user = await kakaoLogin_getUserKakaoInfo(token);
//     if(!user)
//       return res.redirect('/kakao/login');
    
//     return await serviceLogin(req,res,next,user);

//     // return res.status(sc.OK).send(success(statusCode.OK, rm.KAKAO_LOGIN_SUCCESS, response.data));


//   } catch (error) {
//     next(error);
// }
// }

// const kakaoLogin_getUserKakaoInfo =async (token: any) => {
      
//   // 엑세스 토큰을 제대로 전달받은 경우
//     if ("access_token" in token) {
//       const { access_token } = token;
//       // console.log(access_token);
//       const response = await axios({
//         method: 'GET',
//         url: 'https://kapi.kakao.com/v2/user/me',
//         headers:{
//           'Authorization': `Bearer ${access_token}`,
//           'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
//         },
//       })
//       // console.log(response.data)
//       return response.data;
//     } 
//     // 엑세스 토큰이 없으면 로그인페이지로 리다이렉트
//     else {
//       return null;
//     }

// }

const kakaoLogin =async (req: Request, res:Response, next:NextFunction) => {
  const token = req.body

  // 엑세스 토큰이 없으면 에러 반환
  if (!("accessToken" in token)){
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
  }

  const { accessToken } = token;
  try{
    const response = await axios({
      method: 'GET',
      url: 'https://kapi.kakao.com/v2/user/me',
      headers:{
        'Authorization': `Bearer ${accessToken}`,
        'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
    })

    // console.log(response.data)
    return await serviceLogin(req,res,next,response.data);

  }catch(error:any){

    //토큰이 유효하지 않은 경우
    if(error.response.data.msg == "this access token does not exist"){
      return res.status(sc.UNAUTHORIZED).send(fail(sc.UNAUTHORIZED, rm.INVALID_TOKEN));
    }

    return res.status(error.response.status).send(fail(error.response.status, error.response.data.msg));

  }

}
const appleLogin =async (req: Request, res:Response, next:NextFunction) => {
  const token = req.body

  // 엑세스 토큰이 없으면 에러 반환
  if (!("accessToken" in token)){
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
  }

  const { accessToken } = token;
  try{
    const response = await axios({
      method: 'GET',
      url: 'https://kapi.kakao.com/v2/user/me', // 바꿀 에정
      headers:{
        'Authorization': `Bearer ${accessToken}`,
        'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
    })

    // console.log(response.data)
    return await serviceLogin(req,res,next,response.data);

  }catch(error:any){

    //토큰이 유효하지 않은 경우
    if(error.response.data.msg == "this access token does not exist"){
      return res.status(sc.UNAUTHORIZED).send(fail(sc.UNAUTHORIZED, rm.INVALID_TOKEN));
    }

    return res.status(error.response.status).send(fail(error.response.status, error.response.data.msg));

  }

}

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
    return res.status(sc.OK).send(success(sc.OK, rm.SIGNIN_SUCCESS, result));

  }catch(error){
    next(error)
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

const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const { accessToken, refreshToken} = req.body;
    const access_decoded = jwtHandler.accessVerify(accessToken);
    const refresh_decoded = jwtHandler.refreshVerify(refreshToken);

    // 잘못된 accessToken or refreshToken 일 경우
    if ((access_decoded === tokenType.ACCESS_TOKEN_INVALID) || (refresh_decoded === tokenType.REFRESH_TOKEN_INVALID))
      return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.INVALID_TOKEN));

    // 기간이 만료된 경우 -> refreshToken을 이용하여 재발급
    if (access_decoded === tokenType.ACCESS_TOKEN_EXPIRED){
      // refresh token도 만료된 경우 (access,refresh 모두 만료)
      if (refresh_decoded === tokenType.REFRESH_TOKEN_EXPIRED)
        return res.status(sc.UNAUTHORIZED).send(fail(sc.UNAUTHORIZED, rm.EXPIRED_ALL_TOKEN));

      const new_access_token = await userService.refreshToken(refreshToken);
      return res.status(sc.OK).send(success(statusCode.OK, rm.REFRESH_TOKEN_SUCCESS, new_access_token));

    }

  }catch(error){
    next(error)
  }

}


export default{
    getUserById,
    // kakaoLogin_getAuthorizedCode,
    // kakaoLogin_getToken,
    kakaoLogin,
    appleLogin,
    serviceLogin,
    refreshToken
}