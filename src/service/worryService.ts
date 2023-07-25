import { ClientException } from "../common/error/exceptions/customExceptions";
import { rm } from "../constants";
import worryRepository from "../repository/worryRepository"
import { worryCreateDTO,worryUpdateDTO } from "../interfaces/worryDTO";


const postWorry =async (worryCreateDTO: worryCreateDTO) => {
    const worry = await worryRepository.createWorry(worryCreateDTO);
    if (!worry) {
        throw new ClientException(rm.CREATE_WORRY_FAIL);
    }

    const data = {
        createdAt: worry.created_at.toISOString().substring(0,10),
        deadline: worry.deadline.toISOString().substring(0,10)
    }

    return data;
    
}

const patchWorry =async (worryUpdateDTO: worryUpdateDTO) => {
    const worry = await worryRepository.updateWorry(worryUpdateDTO);
    if (!worry) {
        throw new ClientException(rm.UPDATE_WORRY_FAIL);
    }

    const data = {
        updatedAt: worry.updated_at.toISOString().substring(0,10),
    }

    return data;
    
}

const deleteWorry =async (worryId: number,userId: number) => {
    const worry = await worryRepository.findWorryById(worryId);

    if (!worry) {
      throw new ClientException("삭제할 고민글이 존재하지 않습니다.");
    }
    if (worry.user_id != userId) {
      throw new ClientException("고민글 작성자만 삭제할 수 있습니다.");
    }

    await worryRepository.deleteWorry(worryId);
}



export default{
    postWorry,
    patchWorry,
    deleteWorry,

}