import { ClientException } from "../common/error/exceptions/customExceptions";
import { rm } from "../constants";
import { userCreateDTO } from "../interfaces/DTO/userDTO";
import { userRepository } from "../repository"


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

const getUserByAppleId =async (AppleId: string) => {
    return await userRepository.findUserByAppleId(AppleId);

}

const createUser =async (userCreateDTO:userCreateDTO) => {
    const createdUser = await userRepository.createUser(userCreateDTO);
    if(!createUser)
        throw new ClientException("create user fail");
   
    return createdUser;
    
}

const deleteUser = async (userId: number) => {

    const deletedUser = await userRepository.deleteUser(userId);
    if(!deleteUser)
        throw new ClientException("delete user fail");

    return deletedUser;
}

const getAllUser = async () => {

    const users = await userRepository.findAllUser();
    if(!users)
        throw new ClientException("delete user fail");

    const userArr = users
        .map(users => users.id)    // id 값만 추출
    return userArr;
}



export default{
    getUserById,
    getUserByKakaoId,
    getUserByAppleId,
    createUser,
    deleteUser,
    getAllUser
}