import prisma from "./prismaClient";
import { reviewDTO } from "../interfaces/DTO/reviewDTO";

const createReview = async (reviewDTO: reviewDTO) => {
    return await prisma.review.create({
        data: {
            worry_id: reviewDTO.worryId,
            content: reviewDTO.review,
            created_at: new Date(),
            updated_at: new Date(),
        }
    });
};


const updateReview = async (reviewDTO: reviewDTO) => {
    return await prisma.review.update({
        where:{
            worry_id: reviewDTO.worryId
        },
        data:{
            content: reviewDTO.review,
            updated_at: new Date()
        }
    });
};

const findreviewById = async (worryId: number) => {
    return await prisma.review.findUnique({
        where:{
            worry_id: worryId
        }
    });
};

const deleteReviewById = async (worryId: number) => {
    return await prisma.review.delete({
        where:{
            worry_id: worryId
        }
    });
};


export default{
    createReview,
    updateReview,
    findreviewById,
    deleteReviewById
}