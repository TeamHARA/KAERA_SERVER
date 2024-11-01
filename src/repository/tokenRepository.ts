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

const findDeviceTokenById = async (userId: number) => {
    return await prisma.token.findUnique({
        select: {
            device_token: true
        },
        where: {
            user_id: userId,
        }
    });
};


const findDeviceTokenListByIds = async (userId: number[]) => {
    return await prisma.token.findMany({
        select: {
            device_token:true
        },
        where: {
            user_id: { in: userId },
        }
    });
};

const updateTokenById = async (userId: number, refreshToken: string, deviceToken: string) => {
    return await prisma.token.update({
        where: {
            user_id: userId,
        },
        data:{
            refresh_token: refreshToken,
            device_token: deviceToken
        }

    });
};

const disableRefreshTokenById = async (userId: number) => {
    return await prisma.token.update({
        where: {
            user_id: userId
        },
        data:{
            refresh_token: ""
        }
    });
};

const enableDeviceToken = async (userId: number, deviceToken: string) => {
    return await prisma.token.update({
        where: {
            user_id: userId
        },
        data:{
            device_token: deviceToken
        }
    });
};

const disableDeviceToken = async (userId: number) => {
    return await prisma.token.update({
        where: {
            user_id: userId
        },
        data:{
            device_token: ""
        }
    });
};

const findAllDeviceTokens = async () => {
    return await prisma.token.findMany({
        select:{
            device_token: true
        }
    });
};



export default { 
    createRefreshToken,
    findRefreshTokenById,
    findDeviceTokenById,
    findDeviceTokenListByIds,
    updateTokenById,
    disableRefreshTokenById,
    enableDeviceToken,
    disableDeviceToken,
    findAllDeviceTokens
}