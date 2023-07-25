import { ClientException } from "../common/error/exceptions/customExceptions";
import { rm } from "../constants";
import worryRepository from "../repository/worryRepository"
import { worryCreateDTO,worryUpdateDTO } from "../interfaces/worryDTO";
import templateRepository from "../repository/templateRepository";
const moment = require('moment');


const postWorry =async (worryCreateDTO: worryCreateDTO) => {
    const worry = await worryRepository.createWorry(worryCreateDTO);
    if (!worry) {
        throw new ClientException(rm.CREATE_WORRY_FAIL);
    }
    const today = moment();

    const data = {
        createdAt: today.format('YYYY-MM-DD'),
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

const getWorryDetail =async (worryId: number,userId: number) => {
    const worry = await worryRepository.findWorryById(worryId);
    if (!worry) {
        throw new ClientException("해당 id의 고민글이 존재하지 않습니다.");
    }

    const template = await templateRepository.findTemplateById(worry.template_id);
    if (!template) {
        throw new ClientException("해당 id의 템플릿이 존재하지 않습니다.");
    }

    if (worry.user_id != userId) {
        throw new ClientException("고민글 작성자만 조회할 수 있습니다.");
    }


    // d-day 계산
    const today = moment(moment().format('YYYY-MM-DD'));
    const deadline = moment(moment(worry.deadline).format('YYYY-MM-DD'));
    // const deadline = moment(worry.deadline.toISOString().substring(0,10));
    const gap = deadline.diff(today, 'days')

    // local time = kst(korean standard time) 는 utc 기준 +9시간이므로 offset 9로 설정
    const kst_created_at = moment(worry.created_at).utc().utcOffset(9).format('YYYY-MM-DD');
    const kst_updated_at = moment(worry.updated_at).utc().utcOffset(9).format('YYYY-MM-DD');

    const data = {
        "title": worry.title,
        "templateId": worry.template_id,
        "questions": template.questions,
        "answers": worry.answers,
        "period": "",
        "updatedAt": kst_updated_at,
        "deadline": worry.deadline,
        "d-day": gap,
        "finalAnswer": worry.final_answer,
        "review": {
            "content": "" ,
            "updatedAt": ""
        }
    }
    if(worry.final_answer == null)
        data.period = "아직 고민중인 글입니다.";
    else
        data.period = kst_created_at+"~"+kst_updated_at;

    return data;
    
}


export default{
    postWorry,
    patchWorry,
    deleteWorry,
    getWorryDetail,

}