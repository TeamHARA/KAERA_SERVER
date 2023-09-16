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
        select: {
            refresh_token:true
        },
        where: {
            user_id: userId,
        }
    });
};

const findIdByRefreshToken = async (refreshToken: string) => {
    return await prisma.token.findUnique({
        select:{
            user_id:true
        },
        where: {
            refresh_token: refreshToken
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
    findIdByRefreshToken,
    updateRefreshTokenById,
    

}