import prisma from "./prismaClient"
import { worryCreateDTO } from "../interfaces/worryDTO";



const createWorry = async(worryCreateDTO: worryCreateDTO) => {
    const d_day = worryCreateDTO.deadline;
    const date = new Date();
    const deadline_date = new Date();
    deadline_date.setDate(deadline_date.getDate()+d_day);

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

export default {
    createWorry,
}