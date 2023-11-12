import prisma from "./prismaClient"
import { worryCreateDAO,deadlineUpdateDAO } from "../interfaces/DAO/worryDAO";
import { finalAnswerCreateDTO, worryUpdateDTO } from "../interfaces/DTO/worryDTO";
import { wrap } from "module";
// created_at, updated_at 은 디비에 저장시 utc 값으로 저장
// deadline은 kst 값으로 저장

const createWorry = async(worryCreateDAO: worryCreateDAO) => {
    
    const createdWorry = prisma.worry.create({
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

    const user = await prisma.user.findUnique({
        select:{
            used_template: true
        },
        where:{
            id: worryCreateDAO.userId
        }
    })
    if(!user){
        return null
    }
    
    const usedTemplate = user.used_template    
    // 이미 usedTemplate에 해당 templateId가 저장되어 있는 경우 (usedTemplate update 필요 x)
    if(usedTemplate != null && usedTemplate.includes(worryCreateDAO.templateId)){
        return await prisma.$transaction([createdWorry])
    }

    const updateUsedTemplate =  prisma.user.update({
        where: {
            id: worryCreateDAO.userId
        },
        data: {
            used_template: {
                push: worryCreateDAO.templateId
            }
        }
    })

    return await prisma.$transaction([createdWorry,updateUsedTemplate])
}

const updateWorry = async(worryUpdateDTO: worryUpdateDTO) => {

    return await prisma.worry.update({
        where: {
            id: worryUpdateDTO.worryId
        },
        data: {
            template_id: worryUpdateDTO.templateId,
            title: worryUpdateDTO.title,
            answers: worryUpdateDTO.answers,
            updated_at: new Date(),
        }
    })
}

const deleteWorry = async(worryId:number) => {

    const deleteReview = prisma.review.delete({
        where:{
            worry_id: worryId
        }
    })

    const deleteWorry = prisma.worry.delete({
        where: {
            id: worryId
        }
    })

    return await prisma.$transaction([deleteReview,deleteWorry])

}

// const deleteWorryByUserId = async(userId:number) => {

//     return await prisma.worry.deleteMany({
//         where: {
//             user_id: userId
//         }
//     })

// }

const findWorryById = async(worryId:number) => {

    return await prisma.worry.findUnique({
        where: {
            id: worryId
        }
    })

}

const createFinalAnswer = async(finalAnswerCreateDTO: finalAnswerCreateDTO) => {

    return await prisma.worry.update({
        where: {
            id: finalAnswerCreateDTO.worryId
        },
        data: {
            updated_at: new Date(),
            final_answer: finalAnswerCreateDTO.finalAnswer
        }
    })
}

const updateDeadline = async(deadlineUpdateDAO: deadlineUpdateDAO) => {

    return await prisma.worry.update({
        where: {
            id: deadlineUpdateDAO.worryId
        },
        data: {
            updated_at: new Date(),
            deadline: deadlineUpdateDAO.deadline
        }
    })
}

const findWorryListSolved = async(userId: number) => {

    return await prisma.worry.findMany({
        select:{
            id:true,
            user_id:true,
            template_id:true,
            title:true,
            created_at:true,
            updated_at:true
        },    
        where: {
            user_id: userId,
            final_answer:{
                not: null
            }
        },
        orderBy:{
            created_at: 'asc'
        } 
    })
}

const findWorryListUnsolved = async(userId: number) => {

    return await prisma.worry.findMany({
        select:{
            id:true,
            user_id:true,
            template_id:true,
            title:true
        },
        where: {
            user_id: userId,
            final_answer: null
        }, 
        orderBy:{
            created_at: 'asc'
        }
    })
}

const findWorryListByTemplate = async(templateId: number,userId: number) => {

    return await prisma.worry.findMany({
        select:{
            id:true,
            title:true,
            created_at:true,
            updated_at:true,
            template_id:true
        },
        where: {
            user_id: userId,
            template_id: templateId,
            final_answer: {
                not: null
            }
        }, 
        orderBy:{
            created_at: 'asc'
        }
    })
}

export default {
    createWorry,
    updateWorry,
    deleteWorry,
    // deleteWorryByUserId,
    findWorryById,
    createFinalAnswer,
    updateDeadline,
    findWorryListSolved,
    findWorryListUnsolved,
    findWorryListByTemplate

}