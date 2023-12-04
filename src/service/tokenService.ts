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



export default{
    refreshAccessToken,
    getDeviceToken
}