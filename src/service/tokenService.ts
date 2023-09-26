import { ClientException } from "../common/error/exceptions/customExceptions";
import jwtHandler from "../modules/jwtHandler";
import tokenRepository from "../repository/tokenRepository";

const refreshToken =async (refreshToken:string) => {
   
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

export default{
    refreshToken,
}