import prisma from "./prismaClient"
import { worryCreateDTO, worryUpdateDTO} from "../interfaces/worryDTO";

// created_at, updated_at 은 디비에 저장시 utc 값으로 저장
// deadline은 kst 값으로 저장

const createWorry = async(worryCreateDTO: worryCreateDTO) => {
    const d_day = worryCreateDTO.deadline;
    
    const date = new Date(); // utc기준 현재시간
    
    // moment() = kst기준 현재시간
    const moment = require('moment');
    const deadline_date = moment().add(d_day, 'days').format('YYYY-MM-DD');


    return await prisma.worry.create({
        data: {
            template_id: worryCreateDTO.templateId,
            user_id: worryCreateDTO.userId,
            title: worryCreateDTO.title,
            answers: worryCreateDTO.answers,
            created_at: date,
            updated_at: date,
            deadline: new Date(deadline_date),
        }
    })
}

const updateWorry = async(worryUpdateDTO: worryUpdateDTO) => {

    return await prisma.worry.update({
        where: {
            id: worryUpdateDTO.worryId
        },
        data: {
            title: worryUpdateDTO.title,
            answers: worryUpdateDTO.answers,
            updated_at: new Date(),
        }
    })
}

const deleteWorry = async(worryId:number) => {

    return await prisma.worry.delete({
        where: {
            id: worryId
        }
    })

}

const findWorryById = async(worryId:number) => {

    return await prisma.worry.findUnique({
        where: {
            id: worryId
        }
    })

}


export default {
    createWorry,
    updateWorry,
    deleteWorry,
    findWorryById,

}