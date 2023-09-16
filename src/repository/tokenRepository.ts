import prisma from "./prismaClient";


const createRefreshToken = async (userId: number, token: string) => {
    return await prisma.token.create({
        data: {
            user_id: userId,
            refresh_token: token
        }
    });
};

const findRefreshTokenById = async (userId: number) => {
    return await prisma.token.findUnique({
        where: {
            user_id: userId,
        }
    });
};

const updateRefreshTokenById = async (userId: number, token:string) => {
    return await prisma.token.update({
        where: {
            user_id: userId,
        },
        data:{
            refresh_token: token
        }

    });
};


export default { 
    createRefreshToken,
    findRefreshTokenById,
    updateRefreshTokenById,
    

}