import { ClientException } from "../common/error/exceptions/customExceptions";
import jwtHandler from "../modules/jwtHandler";
import tokenRepository from "../repository/tokenRepository";

const refreshAccessToken =async (refreshToken:string) => {
   
    const user = await tokenRepository.findIdByRefreshToken(refreshToken)
    if(!user){
        throw new ClientException("refresh token not found in database");
    }

    const token = jwtHandler.access(user.user_id);
    const data = {
        "accessToken": token
    }

    return data;
}

const getDeviceToken =async (userId: number) => {
   
    const data = await tokenRepository.findDeviceTokenById(userId);
    if(!data){
        throw new ClientException("device token not found in database");
    }

    return data.device_token;
}


const setDeviceToken =async (userId: number, deviceToken: string) => {
   

    const data = await tokenRepository.enableDeviceToken(userId, deviceToken)
    

    return
}

const disableDeviceToken =async (userId: number, deviceToken: string) => {
    const isValidToken = await tokenRepository.findDeviceTokenById(userId)
    if(!isValidToken){
        throw new ClientException("device token not found in database");
    }

    if(isValidToken.device_token != deviceToken){
        throw new ClientException("wrong device token")
    }

    return await tokenRepository.disableDeviceToken(userId)
    
}


export default{
    refreshAccessToken,
    getDeviceToken,
    setDeviceToken,
    disableDeviceToken
}