// src/modules/jwtHandler.ts
import jwt from "jsonwebtoken";
import tokenType from "../constants/tokenType";
// import { tokenType } from ".../constants/";

//* 받아온 userId를 담는 access token 생성
const access = (userId: number) => {
  const payload = {
    userId,
  };

  var accessToken;
  // dev user일 경우
  if(userId == 11){
    accessToken = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: "90d" });
  }
  else{
    accessToken = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: "2h" });
  }
  
  return accessToken;
};

//* access token 검사!
const accessVerify = (token: string) => {
  let decoded: string | jwt.JwtPayload;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET as string);
  } catch (error: any) {
    if (error.message === "jwt expired") {
      return tokenType.ACCESS_TOKEN_EXPIRED;
    } else if (error.message === "invalid token") {
      return tokenType.ACCESS_TOKEN_INVALID;
    } else {
      return tokenType.ACCESS_TOKEN_INVALID;
    }
  }

  return decoded;
};

// refresh token 발급
const refresh = () => { 
  //refresh token은 payload 없이 
  return jwt.sign({},process.env.JWT_SECRET as string, { expiresIn: "14d" });
}

//* refresh token 검사!
const refreshVerify = (token: string) => {
  let decoded: string | jwt.JwtPayload;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET as string);
  } catch (error: any) {
    if (error.message === "jwt expired") {
      return tokenType.REFRESH_TOKEN_EXPIRED;
    } else if (error.message === "invalid token") {
      return tokenType.REFRESH_TOKEN_INVALID;
    } else {
      return tokenType.REFRESH_TOKEN_INVALID;
    }
  }

  return decoded;
}

export default {
  access,
  accessVerify,
  refresh,
  refreshVerify,

};