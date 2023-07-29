import prisma from "./prismaClient"
import { worryCreateDAO } from "../interfaces/DAO/worryDAO";
import { makeFinalAnswerDTO, worryUpdateDTO } from "../interfaces/DTO/worryDTO";
// created_at, updated_at 은 디비에 저장시 utc 값으로 저장
// deadline은 kst 값으로 저장

const createWorry = async(worryCreateDAO: worryCreateDAO) => {
  
    return await prisma.worry.create({
        data: {
            template_id: worryCreateDAO.templateId,
            user_id: worryCreateDAO.userId,
            title: worryCreateDAO.title,
            answers: worryCreateDAO.answers,
            created_at: worryCreateDAO.createdAt,
            updated_at: worryCreateDAO.updatedAt,
            deadline: worryCreateDAO.deadlineDate
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

const makeFinalAnswer = async(makeFinalAnswerDTO: makeFinalAnswerDTO) => {

    return await prisma.worry.update({
        where: {
            id: makeFinalAnswerDTO.worryId
        },
        data: {
            final_answer: makeFinalAnswerDTO.finalAnswer
        }
    })
}


export default {
    createWorry,
    updateWorry,
    deleteWorry,
    findWorryById,
    makeFinalAnswer

}