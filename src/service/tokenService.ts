import { ClientException } from "../common/error/exceptions/customExceptions";
import jwtHandler from "../modules/jwtHandler";
import tokenRepository from "../repository/tokenRepository";

const refreshAccessToken =async (userId: number, refreshToken:string) => {

    const user = await tokenRepository.findRefreshTokenById(userId)
    if(!user){
        throw new ClientException("Invlalid userId | accessToken");
    }
    if(user.refresh_token != refreshToken){
        throw new ClientException("Invalid refreshToken(refreshToken doesn't match with user)");
    }

    const token = jwtHandler.access(userId);
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