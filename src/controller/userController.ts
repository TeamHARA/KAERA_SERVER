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

// 캐라 서비스의 로그인 함수
const serviceLogin = async (req: Request, res:Response,next:NextFunction, user:any) => {
  try{
    const { id, kakao_account } = user;

    const foundUser = await userService.getUserByKakaoId(id);

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

      return await createUser(req,res);

    }

    //가입한 회원일 경우, 로그인 진행
    return await loginUser(req,res,foundUser);

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


const createUser = async (req: Request, res: Response) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
    }
  
    const userCreateDto: userCreateDTO = req.body;
    // console.log(userCreateDto)

    const data = await userService.createUser(userCreateDto);
  
    if (!data) {
      return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.SIGNUP_FAIL));
    }
  
    //local accessToken 생성
    const accessToken = jwtHandler.sign(data.id);
  
    const result = {
      id: data.id,
      name: data.name,
      accessToken,
    };
  
    return res.status(sc.CREATED).send(success(sc.CREATED, rm.SIGNUP_SUCCESS, result));
  };

  const loginUser = async (req: Request, res: Response, user: any) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
    }
  
    //accessToken 생성
    const accessToken = jwtHandler.sign(user.id);
  
    const result = {
      id: user.id,
      name: user.name,
      accessToken,
    };
  
    return res.status(sc.OK).send(success(sc.OK, rm.SIGNIN_SUCCESS, result));
  };


export default{
    getUserById,
    createUser,
    loginUser,
    // kakaoLogin_getAuthorizedCode,
    // kakaoLogin_getToken,
    kakaoLogin,
    serviceLogin,
}