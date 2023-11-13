import userService from "./userService";
import jwtHandler from "../modules/jwtHandler";
import { ClientException } from "../common/error/exceptions/customExceptions";
import { tokenRepository,userRepository } from "../repository";
import worryRepository from "../repository/worryRepository";


// 캐라 서비스의 로그인 함수
const serviceLogin = async (provider:string, user:any) => {
    const userCreateDTO: any = {};
    let isNew = false;
    let foundUser;

    // kakao login
    if(provider == "kakao"){
      const { id, kakao_account } = user;
  
      foundUser = await userService.getUserByKakaoId(id);

  
      //가입하지 않은 회원일 경우, 회원가입 진행
      if(!foundUser){
        
        //필수 동의만 했을 경우
        userCreateDTO.kakaoId = id,
        userCreateDTO.name = kakao_account.profile.nickname
        

        //선택 동의도 했을 경우
        if(kakao_account.email)
            userCreateDTO.email = kakao_account.email
        if(kakao_account.age_range)
            userCreateDTO.ageRange = kakao_account.age_range
        if(kakao_account.gender)
            userCreateDTO.gender = kakao_account.gender

        isNew = true
      }
    }//kakao


    // apple login
    if(provider == "apple"){
      const jwt = require("jsonwebtoken");
      const jwksClient = require('jwks-rsa');
      const client = jwksClient({
        jwksUri: 'https://appleid.apple.com/auth/keys',
        timeout: 30000 // Defaults to 30s
      });

      // 전달받은 identityToken이 변조되지 않은 올바른 토큰인지 확인하는 과정
      const {identityToken, id, fullName} = user;
      const decoded = jwt.decode(identityToken, { complete: true})
      const kid = decoded.header.kid
      
      const key = await client.getSigningKey(kid);
      const signingKey = key.getPublicKey();
      if(!signingKey){
        throw new ClientException("signinKey missing");
      }

      const payload = jwt.verify(identityToken, signingKey);
      if(!payload){
        throw new ClientException("jwt verification fail");
      }

      // 발급한 주체가(aud)가 우리의 서비스 id 와 일치하는지
      // 사용자 식별 id 가 일치하는지
      if(payload.sub !== id || payload.aud !== process.env.APPLE_CLIENT_ID){
        throw new ClientException("invliad signIn request");
      }

      foundUser = await userService.getUserByAppleId(id);

      if(!foundUser){
      
        userCreateDTO.appleId = id;
        userCreateDTO.name = fullName;
        isNew = true
      }

    }// apple


    // local refreshToken 먼저 발급후, 회원가입시 같이 DB에 저장
    const refreshToken = jwtHandler.refresh();
    // 새로운 회원일 경우 회원가입 진행
    if(isNew){
      userCreateDTO.refreshToken = refreshToken;
      const createdUser = await userService.createUser(userCreateDTO);
      foundUser = createdUser
    }

    // 기존 유저, 새로운 유저 둘 다 존재하지 않을 시
    if(!foundUser){
      throw new ClientException("로그인 및 회원가입 실패");
    }


    // 기존 유저의 경우 이전 refresh token을 갱신하여 DB에 저장
    if(!isNew){
      const updatedToken = await tokenRepository.updateRefreshTokenById(foundUser.id,refreshToken);
      if(!updatedToken){
        throw new ClientException("refresh token 갱신 실패");
      }
    }

    
    //local accessToken 발급
    const accessToken = jwtHandler.access(foundUser.id);

    const result = {
      id: foundUser.id,
      name: foundUser.name,
      accessToken,
      refreshToken
    };


    const data = {
      isNew,result
    }

    return data;
  
 }

const serviceLogout = async (userId:number) => {
  
  const token = await tokenRepository.disableRefreshTokenById(userId);
  if(!token){
    throw new ClientException("refresh token delete fail");
  }

}

const serviceUnregister = async (userId:number) => {
  
  const user = await userRepository.deleteUser(userId);
  if(!user){
    throw new ClientException("user delete fail");
  }

}


  export default{
    serviceLogin,
    serviceLogout,
    serviceUnregister
}