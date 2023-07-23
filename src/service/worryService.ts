import { ClientException } from "../common/error/exceptions/customExceptions";
import { rm } from "../constants";
import worryRepository from "../repository/worryRepository"
import { worryCreateDTO } from "../interfaces/worryDTO";


const postWorry =async (worryCreateDTO: worryCreateDTO) => {
    const worry = await worryRepository.createWorry(worryCreateDTO);
    if (!worry) {
        throw new ClientException(rm.CREATE_WORRY_FAIL);
    }

    const data = {
        createdAt: worry.created_at.toISOString().substring(0,10),
    }

    return data;
    
}

export default{
    postWorry,

}