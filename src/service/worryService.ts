import { ClientException } from "../common/error/exceptions/customExceptions";
import { rm } from "../constants";
import worryRepository from "../repository/worryRepository"
import { finalAnswerCreateDTO, worryCreateDTO, worryUpdateDTO, deadlineUpdateDTO } from "../interfaces/DTO/worryDTO";
import { deadlineUpdateDAO, worryCreateDAO } from "../interfaces/DAO/worryDAO";
import templateRepository from "../repository/templateRepository";
const moment = require('moment');

const postWorry =async (worryCreateDTO: worryCreateDTO) => {
    const date = new Date(); // utc기준 현재시간
    const d_day = worryCreateDTO.deadline;
    // const moment = require('moment');   // moment() = kst기준 현재시간
    
    let deadlineDate;
    if(d_day != -1){
        const deadline = moment().add(d_day, 'days').format('YYYY-MM-DD');
        deadlineDate = new Date(deadline);
    }
    else{
        deadlineDate = null;
    }
    const worryCreateDAO: worryCreateDAO = {
        ...worryCreateDTO,
        createdAt: date,
        updatedAt: date,
        deadlineDate: deadlineDate
    }
    // console.log(worryCreateDAO)

    const worry = await worryRepository.createWorry(worryCreateDAO);
    if (!worry) {
        throw new ClientException(rm.CREATE_WORRY_FAIL);
    }


    const data = {
        createdAt: moment().format('YYYY-MM-DD'),
        deadline: "데드라인이 없습니다."
    }
    if(worry.deadline != null)
        data.deadline = worry.deadline.toISOString().substring(0,10)

    return data;
    
}

const patchWorry =async (worryUpdateDTO: worryUpdateDTO) => {
    const worry = await worryRepository.updateWorry(worryUpdateDTO);
    if (!worry) {
        throw new ClientException(rm.UPDATE_WORRY_FAIL);
    }

    const data = {
        updatedAt: moment().format('YYYY-MM-DD'),
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

    let gap;
    // (데드라인 존재하는 경우) : gap = d-day에 해당하는 값
    if (worry.deadline != null){
        // d-day 계산 (날짜 차이 계산을 위해 today 와 deadline을 moment 객체로 만들어줌)
        const today = moment(moment().format('YYYY-MM-DD'));
        const deadline = moment(moment(worry.deadline).format('YYYY-MM-DD'));
        gap = deadline.diff(today, 'days')
    }
    // (데드라인 존재하지 않을 경우) : gap = -1
    else{
        gap = -1;
    }

    // local time = kst(korean standard time) 는 utc 기준 +9시간이므로 offset 9로 설정
    const kst_created_at = moment(worry.created_at).utc().utcOffset(9).format('YYYY-MM-DD');
    const kst_updated_at = moment(worry.updated_at).utc().utcOffset(9).format('YYYY-MM-DD');

    const data = {
        "title": worry.title,
        "templateId": worry.template_id,
        "questions": template.questions,
        "answers": worry.answers,
        "period": "아직 고민중인 글입니다.",
        "updatedAt": kst_updated_at,
        "deadline": "데드라인이 없습니다.",
        "d-day": gap,
        "finalAnswer": worry.final_answer,
        "review": {
            "content": "" ,
            "updatedAt": ""
        }
    }
    if(worry.final_answer != null)
        data.period = kst_created_at+" ~ "+kst_updated_at;

    if(worry.deadline != null)
        data.deadline = worry.deadline.toISOString().substring(0,10)

    return data;
    
}

const patchFinalAnswer =async (finalAnswerCreateDTO: finalAnswerCreateDTO) => {
    const worry = await worryRepository.makeFinalAnswer(finalAnswerCreateDTO);

    if (!worry) {
        throw new ClientException(rm.MAKE_FINAL_ANSWER_FAIL);
    }

    if (worry.user_id != finalAnswerCreateDTO.userId) {
        throw new ClientException("고민글 작성자만 최종결정할 수 있습니다.");
    }
    
}

const patchDeadline =async (deadlineUpdateDTO: deadlineUpdateDTO) => {
    
    const d_day = deadlineUpdateDTO.dayCount;
    const moment = require('moment');   // moment() = kst기준 현재시간
    
    //deadline 계산
    let deadlineDate = null;
    if(d_day != -1){
        const deadline = moment().add(d_day, 'days').format('YYYY-MM-DD');
        deadlineDate = new Date(deadline);
    }
    const deadlineUpdateDAO: deadlineUpdateDAO = {
        worryId: deadlineUpdateDTO.worryId,
        deadline: deadlineDate
    }

    //d-day 계산
    let gap = -1;                   // (데드라인 존재하지 않을 경우) : gap = -1
    if (deadlineDate != null){      // (데드라인 존재하는 경우) : gap = d-day에 해당하는 값
        const today = moment(moment().format('YYYY-MM-DD'));        // d-day 계산 (날짜 차이 계산을 위해 today 와 deadline을 moment 객체로 만들어줌)
        const deadline = moment(moment(deadlineDate).format('YYYY-MM-DD'));
        gap = deadline.diff(today, 'days')
    }



    const worry = await worryRepository.updateDeadline(deadlineUpdateDAO);
    if (!worry) {
        throw new ClientException(rm.MAKE_FINAL_ANSWER_FAIL);
    }
    if (worry.user_id != deadlineUpdateDTO.userId) {
        throw new ClientException("고민글 작성자만 데드라인을 수정할 수 있습니다.");
    }
    
    const data = {
        "deadline": "데드라인이 없습니다.",
        "d-day": gap,
    }

    if(worry.deadline != null)
        data.deadline = worry.deadline.toISOString().substring(0,10)


    return data;    

}

const getWorryList =async (isSolved: number, userId: number) => {
    let worry = null;
    if(isSolved)
        worry = await worryRepository.findWorryListSolved(userId);
    else
        worry = await worryRepository.findWorryListUnsolved(userId);

    if (!worry) {
        throw new ClientException(rm.GET_WORRY_LIST_FAIL);
    }

    const data :Array<object> = [];
    for(var i=0;i<worry.length;i++){
        data.push({
            "worryId": worry[i].id,
            "templateId": worry[i].template_id,
            "title": worry[i].title
        })
        
    }
    
    return data;
  
}

const getWorryListByTemplate =async (templateId: number, userId: number) => {
  
    const worry = await worryRepository.findWorryListByTemplate(templateId,userId);
  
    if (!worry) {
        throw new ClientException(rm.GET_WORRY_LIST_BY_TEMPLATE_FAIL);
    }

    const worry_list :Array<object> = [];
    for(var i=0;i<worry.length;i++){
        const kst_created_at = moment(worry[i].created_at).utc().utcOffset(9).format('YYYY-MM-DD');
        const kst_updated_at = moment(worry[i].updated_at).utc().utcOffset(9).format('YYYY-MM-DD');
        
        worry_list.push({
            "worryId": worry[i].id,
            "title": worry[i].title,
            "period": kst_created_at + " ~ " + kst_updated_at
        })   
    }

    const data = {
        "totalNum": worry_list.length,
        "worry": worry_list,
    }
    
    return data;
  
}


export default{
    postWorry,
    patchWorry,
    deleteWorry,
    getWorryDetail,
    patchFinalAnswer,
    patchDeadline,
    getWorryList,
    getWorryListByTemplate


}