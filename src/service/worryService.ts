import { ClientException } from "../common/error/exceptions/customExceptions";
import { rm } from "../constants";
import worryRepository from "../repository/worryRepository"
import { finalAnswerCreateDTO, worryCreateDTO, worryUpdateDTO, deadlineUpdateDTO } from "../interfaces/DTO/worryDTO";
import { deadlineUpdateDAO, finalAnswerCreateDAO, worryCreateDAO } from "../interfaces/DAO/worryDAO";
import templateRepository from "../repository/templateRepository";
import { calculate_d_day, calculate_random_num } from "../common/utils/calculate";
import reviewRepository from "../repository/reviewRepository";
import quoteRepository from "../repository/quoteRepository";
import moment from "moment";

const postWorry =async (worryCreateDTO: worryCreateDTO) => {
    const date = new Date(); // utc기준 현재시간
    const deadline = worryCreateDTO.deadline;
    // const moment = require('moment');   // moment() = kst기준 현재시간
    
    let deadlineDate;
    if(deadline != -1){
        const today_plus_deadline = moment().add(deadline, 'days').format('YYYY-MM-DD');
        deadlineDate = new Date(today_plus_deadline);
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

    const data:any = {
        worryId: worry.id,
        title: worry.title,
        templateId: worry.template_id,
        answers: worry.answers,
        createdAt: moment(worry.created_at).utc().utcOffset(9).format('YYYY-MM-DD'),
        deadline: "데드라인이 없습니다.",
        dDay: -888
    }
    
    if(worry.deadline != null){
        data.deadline = worry.deadline.toISOString().substring(0,10)
        data.dDay = deadline
    }

    return data;
    
}

const patchWorry =async (worryUpdateDTO: worryUpdateDTO) => {
    const worry = await worryRepository.findWorryById(worryUpdateDTO.worryId);

    if (!worry) {
      throw new ClientException("수정할 고민글이 존재하지 않습니다.");
    }
    if (worry.user_id != worryUpdateDTO.userId) {
      throw new ClientException("고민글 작성자만 수정할 수 있습니다.");
    }
   
    const updatedWorry = await worryRepository.updateWorry(worryUpdateDTO);
    if (!updatedWorry) {
        throw new ClientException(rm.UPDATE_WORRY_FAIL);
    }

    const data = {
        updatedAt: moment(updatedWorry.updated_at).utc().utcOffset(9).format('YYYY-MM-DD'),
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

    const review = await reviewRepository.findreviewById(worryId);
    if(!review){
        return await worryRepository.deleteWorryWithoutReview(worryId);
    }

    return await worryRepository.deleteWorryWithReview(worryId);
}

const getWorryDetail =async (worryId: number,userId: number) => {
    const worry = await worryRepository.findWorryById(worryId);
    if (!worry) {
        throw new ClientException("해당 id의 고민글이 존재하지 않습니다.");
    }

    if (worry.user_id != userId) {
        throw new ClientException("고민글 작성자만 조회할 수 있습니다.");
    }
    const template = await templateRepository.findTemplateById(worry.template_id);
    if (!template) {
        throw new ClientException("해당 id의 템플릿이 존재하지 않습니다.");
    }

    const review = await reviewRepository.findreviewById(worry.id);

    const gap = calculate_d_day(worry.deadline);
   

    // local time = kst(korean standard time) 는 utc 기준 +9시간이므로 offset 9로 설정
    const kst_created_at = moment(worry.created_at).utc().utcOffset(9).format('YYYY-MM-DD');
    const kst_updated_at = moment(worry.updated_at).utc().utcOffset(9).format('YYYY-MM-DD');

    const data:any = {
        "title": worry.title,
        "templateId": worry.template_id,
        "subtitles": template.subtitles,
        "answers": worry.answers,
        "period": "아직 고민중인 글입니다.",
        "updatedAt": kst_updated_at,
        "deadline": "데드라인이 없습니다.",
        "dDay": gap,
        "finalAnswer": worry.final_answer,
        "review":{
            "content" : null,
            "updatedAt": null
        }
    }

   
    // 최종 결정 내린 고민
    if(worry.final_answer != null){
        data.period = kst_created_at+" ~ "+kst_updated_at;
        data.review.updatedAt = kst_updated_at
    }

    // 최종 결정 이후
    // 리뷰 작성한 경우
    if(review != null){
        data.review.content = review.content,
        data.review.updatedAt = moment(review.updated_at).utc().utcOffset(9).format('YYYY-MM-DD')
    }

    if(worry.deadline != null)
        data.deadline = worry.deadline.toISOString().substring(0,10)

    return data;
    
}

const patchFinalAnswer =async (finalAnswerCreateDTO: finalAnswerCreateDTO) => {
    const worry = await worryRepository.findWorryById(finalAnswerCreateDTO.worryId);

    if (!worry) {
        throw new ClientException("해당 id의 고민글이 존재하지 않습니다.");
    }
    
    if (worry.user_id != finalAnswerCreateDTO.userId) {
        throw new ClientException("고민글 작성자만 최종결정할 수 있습니다.");
    }

    if (worry.final_answer){
        throw new ClientException("한 번 내린 최종결정은 수정 불가합니다.");
    }

    const finalAnswerCreateDAO: finalAnswerCreateDAO = {
        ...finalAnswerCreateDTO,
        templateId: worry.template_id
    }
    const updatedWorry = await worryRepository.createFinalAnswer(finalAnswerCreateDAO);
    if (!updatedWorry) {
        throw new ClientException(rm.MAKE_FINAL_ANSWER_FAIL);
    }

    const quotes = await quoteRepository.findAllQuote();
    const random_quote = quotes[calculate_random_num(quotes.length)].content

    const quote_data = {
        "quote": random_quote
    }

    const alarm_data = {
        "templateId": worry.template_id
    }

    const data = {
        quote_data,
        alarm_data
    }

    return data;
    
}

const patchDeadline =async (deadlineUpdateDTO: deadlineUpdateDTO) => {
    const worry = await worryRepository.findWorryById(deadlineUpdateDTO.worryId)
    if(!worry){
        throw new ClientException("해당 id의 고민글이 존재하지 않습니다.");
    }
    if (worry.user_id != deadlineUpdateDTO.userId) {
        throw new ClientException("고민글 작성자만 데드라인을 수정할 수 있습니다.");
    }

    
    const d_day = deadlineUpdateDTO.dayCount;
    const moment = require('moment');   // moment() = kst기준 현재시간
    
    //deadline 계산
    let deadlineDate = null;
    if(d_day != -1){
        const deadline = moment().add(d_day, 'days').format('YYYY-MM-DD');
        deadlineDate = new Date(deadline);
    }
    const deadlineUpdateDAO: deadlineUpdateDAO = {
        worryId: deadlineUpdateDTO.worryId!,
        deadline: deadlineDate
    }

    //d-day 계산
    const gap = calculate_d_day(deadlineDate)


    const updatedWorry = await worryRepository.updateDeadline(deadlineUpdateDAO);
    if (!updatedWorry) {
        throw new ClientException(rm.UPDATE_DEADLINE_FAIL);
    }

    
    const data = {
        "deadline": "데드라인이 없습니다.",
        "dDay": gap,
    }

    if(updatedWorry.deadline != null)
        data.deadline = updatedWorry.deadline.toISOString().substring(0,10)


    return data;    

}

const getWorryList =async (isSolved: number, page: number, limit: number, userId: number) => {
    let worry = null;
    if(isSolved)
        worry = await worryRepository.findWorryListSolved(userId,page,limit);
    else
        worry = await worryRepository.findWorryListUnsolved(userId,page,limit);

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
    let worry;
    if(templateId == 0)
        worry = await worryRepository.findAllWorryListSolved(userId);
    else
        worry = await worryRepository.findWorryListByTemplate(templateId,userId);
    
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
            "period": kst_created_at + " ~ " + kst_updated_at,
            "templateId": worry[i].template_id,
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