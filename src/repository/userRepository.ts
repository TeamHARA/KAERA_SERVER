import { userCreateDTO } from "../interfaces/DTO/userDTO";
import prisma from "./prismaClient";


const findUserById = async (userId: number) => {
    return await prisma.user.findUnique({
        where: {
            id: userId
        }
    });
};

const findUserByKakaoId = async (KakaoId: number) => {
    return await prisma.user.findUnique({
        where: {
            kakao_id: KakaoId
        }
    });
};

const findUserByAppleId = async (AppleId: string) => {
    return await prisma.user.findUnique({
        where: {
            apple_id: AppleId
        }
    });
};

const createUser = async(userCreateDTO:userCreateDTO) => {
    return await prisma.user.create({
        data:{
            kakao_id: userCreateDTO.kakaoId,
            apple_id: userCreateDTO.appleId,
            name: userCreateDTO.name,
            email: userCreateDTO.email,
            age_range: userCreateDTO.ageRange,
            gender: userCreateDTO.gender,
            created_at: new Date(),
            updated_at: new Date(),

            token:{
                create:{
                    refresh_token: userCreateDTO.refreshToken,
                    device_token: userCreateDTO.deviceToken
                }
            }
        }
    })
}


const deleteUser = async(userId: number) => {
      
    const deletedReview = prisma.review.deleteMany({
        where: {
            user_id: userId
        }
    })

    const deletedWorry = prisma.worry.deleteMany({
        where: {
            user_id: userId
        }
    })

    const deletedToken = prisma.token.delete({
        where: {
           user_id: userId
        }
    })

    const deletedUser = prisma.user.delete({
        where:{
            id: userId
        }
    })

    return await prisma.$transaction([deletedReview,deletedWorry,deletedToken,deletedUser])

}

// ? class로 사용하는 경우는 언제 ?
// export class userRepository{
//     findUserById = async (userId: number) => {
//         return await prisma.user.findUnique({
//             where: {
//                 id: userId
//             }
//         });
//     };

//     createUserbyName = async(userName: string) => {
//         return await prisma.user.create({
//             data:{
//                 name: userName
//             }
//         })
//     }
// }

export default { 
    findUserById,
    createUser,
    findUserByKakaoId,
    findUserByAppleId,
    deleteUser
 };