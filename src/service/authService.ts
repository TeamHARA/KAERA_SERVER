import userService from "./userService";
import jwtHandler from "../modules/jwtHandler";
import tokenRepository from "../repository/tokenRepository";
import { ClientException } from "../common/error/exceptions/customExceptions";



// 캐라 서비스의 로그인 함수
const serviceLogin = async (provider:string, user:any) => {
    const userCreateDTO: any = {};
    let isNew = false;
    let foundUser;

    // kakao login으로 유저 정보 갖고온 경우
    if(provider == "kakao"){
      const { id, kakao_account } = user;
      console.log(user)
  
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


        //회원가입
        const createdUser = await userService.createUser(userCreateDTO);
        foundUser = createdUser
        isNew = true
      }
    }


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
      console.log(payload)
      if(!payload){
        throw new ClientException("jwt verification fail");
      }

      // 발급한 주체가(aud)가 우리의 서비스 id 와 일치하는지
      // 사용자 식별 id 가 일치하는지
      if(payload.sub !== id || payload.aud !== process.env.APPLE_CLIENT_ID){
        throw new ClientException("invliad signIn reqeust");
      }

      foundUser = await userService.getUserByAppleId(id);
      if(!foundUser){
        

        userCreateDTO.AppleId = id;
        userCreateDTO.name = fullName;
        userCreateDTO.email = payload.email;

         //회원가입
         const createdUser = await userService.createUser(userCreateDTO);
         foundUser = createdUser
         isNew = true
      }

    }
    
    if(!foundUser){
      throw new ClientException("로그인 및 회원가입 실패");
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
    const token = await tokenRepository.findRefreshTokenById(foundUser.id);
    if(!token){
      await tokenRepository.createRefreshToken(foundUser.id, refreshToken);
    }
    await tokenRepository.updateRefreshTokenById(foundUser.id,refreshToken);

    const data = {
      isNew,result
    }

    return data;
  
 }

  const serviceLogout = async () => {
  

   // await tokenRepository.updateRefreshTokenById(accessToken, refreshToken);
  

}


  export default{
    serviceLogin,
    serviceLogout
}