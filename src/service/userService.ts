import { ClientException } from "../common/error/exceptions/customExceptions";
import { rm } from "../constants";
import { userCreateDTO } from "../interfaces/DTO/userDTO";
import jwtHandler from "../modules/jwtHandler";
import { userRepository } from "../repository"
import tokenRepository from "../repository/tokenRepository";

// const userop = new userRepository();

const getUserById =async (userId: number) => {
    const foundUser = await userRepository.findUserById(userId);
 
    if (!foundUser) {
        throw new ClientException(rm.NO_USER);
    }
    return foundUser;

}

const getUserByKakaoId =async (KakaoId: number) => {
    return await userRepository.findUserByKakaoId(KakaoId);

}

const createUser =async (userCreateDTO:userCreateDTO) => {
   
    return await userRepository.createUser(userCreateDTO);
    
}

const refreshToken =async (refreshToken:string) => {
   
    const user = await tokenRepository.findIdByRefreshToken(refreshToken)
    if(!user){
        throw new ClientException("refresh token not found in database");
    }

    return jwtHandler.access(user.user_id);
}


export default{
    getUserById,
    getUserByKakaoId,
    createUser,
    refreshToken,
}