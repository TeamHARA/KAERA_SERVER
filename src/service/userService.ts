import { ClientException } from "../common/error/exceptions/customExceptions";
import { rm } from "../constants";
import { userCreateDTO } from "../interfaces/DTO/userDTO";
import { userRepository } from "../repository"

// const userop = new userRepository();

const getUserById =async (userId: number) => {
    const foundUser = await userRepository.findUserById(userId);
 
    if (!foundUser) {
        throw new ClientException(rm.NO_USER);
    }
    return foundUser;

}

const createUser =async (userCreateDTO:userCreateDTO) => {
   
    return await userRepository.createUser(userCreateDTO);
    
}

export default{
    getUserById,
    createUser,
}