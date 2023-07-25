import prisma from "./prismaClient"
import { worryCreateDTO, worryUpdateDTO} from "../interfaces/worryDTO";



const createWorry = async(worryCreateDTO: worryCreateDTO) => {
    const d_day = worryCreateDTO.deadline;
    const date = new Date();
    const deadline_date = new Date();
    deadline_date.setDate(date.getDate()+d_day);

    return await prisma.worry.create({
        data: {
            template_id: worryCreateDTO.templateId,
            user_id: worryCreateDTO.userId,
            title: worryCreateDTO.title,
            answers: worryCreateDTO.answers,
            created_at: date,
            updated_at: date,
            deadline: deadline_date,
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