import prisma from "../../prisma/prismaClient"
import { worryCreateDAO,deadlineUpdateDAO, finalAnswerCreateDAO } from "../interfaces/DAO/worryDAO";
import { finalAnswerCreateDTO, worryUpdateDTO } from "../interfaces/DTO/worryDTO";

// created_at, updated_at 은 디비에 저장시 utc 값으로 저장
// deadline은 kst 값으로 저장

const createWorry = async(worryCreateDAO: worryCreateDAO) => {
    
    return prisma.worry.create({
        data: {
            template_id: worryCreateDAO.templateId,
            user_id: worryCreateDAO.userId,
            title: worryCreateDAO.title,
            answers: worryCreateDAO.answers,
            created_at: new Date(),
            updated_at: new Date(),
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
            template_id: worryUpdateDTO.templateId,
            title: worryUpdateDTO.title,
            answers: worryUpdateDTO.answers,
            updated_at: new Date(),
        }
    })
}

const deleteWorryWithReview = async(worryId:number) => {

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

const deleteWorryWithoutReview = async(worryId:number) => {

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

const createFinalAnswer = async(finalAnswerCreateDAO: finalAnswerCreateDAO) => {

    const user = await prisma.user.findUnique({
        select:{
            used_template: true
        },
        where:{
            id: finalAnswerCreateDAO.userId
        }
    })
    if(!user){
        return null;
    }

    const createdFinalAnswer = prisma.worry.update({
        where: {
            id: finalAnswerCreateDAO.worryId
        },
        data: {
            updated_at: new Date(),
            final_answer: finalAnswerCreateDAO.finalAnswer
        }
    })

    const usedTemplate = user.used_template    
    // 이미 usedTemplate에 해당 templateId가 저장되어 있는 경우 (usedTemplate update 필요 x)
    if(usedTemplate.includes(finalAnswerCreateDAO.templateId)){
        return await prisma.$transaction([createdFinalAnswer])
    }

    const updateUsedTemplate = prisma.user.update({
        where: {
            id: finalAnswerCreateDAO.userId
        },
        data: {
            used_template: {
                push: finalAnswerCreateDAO.templateId
            }
        }
    })

    return await prisma.$transaction([createdFinalAnswer,updateUsedTemplate])

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

const findAllWorryListSolved = async(userId: number) => {

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
            updated_at: 'desc'
        } 
    })
}

const findWorryListSolved = async(userId: number, page: number, limit: number) => {

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
        skip: (page - 1) * limit,
        take: limit,
        orderBy:{
            updated_at: 'desc'
        } 
    })
}

const findWorryListUnsolved = async(userId: number, page: number, limit: number) => {

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
        skip: (page - 1) * limit,
        take: limit, 
        orderBy:{
            created_at: 'desc'
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
            updated_at: 'desc'
        }
    })
}

const findUserListByDeadline = async(date: Date) => {

    return await prisma.worry.findMany({
       include:{
            user:{
                include:{
                    token:true
                }
            }
        },
        where: {
            deadline: date,
            final_answer: null
        }
    })

}

const findUserListWithNoDeadline = async(date: string) => {

    return await prisma.$queryRaw`SELECT user_id, id FROM worry WHERE DATE(created_at) = DATE(${date}) AND final_answer = NULL`;

}


export default {
    createWorry,
    updateWorry,
    deleteWorryWithReview,
    deleteWorryWithoutReview,
    findWorryById,
    createFinalAnswer,
    updateDeadline,
    findWorryListSolved,
    findAllWorryListSolved,
    findWorryListUnsolved,
    findWorryListByTemplate,
    findUserListByDeadline,
    findUserListWithNoDeadline

}