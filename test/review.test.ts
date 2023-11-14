import { prismaMock } from './singleton';
import  reviewService  from '../src/service/reviewService';
import worryService from '../src/service/worryService';

// valid한 worryId == 1
beforeEach(async () => {

    const worry = {
        id: 1,
        template_id: 1,
        user_id: 1,
        title: 'test~!~!~!',
        answers: ['답변1','답변2','답변3'],
        created_at: new Date('2020-01-01'),
        updated_at: new Date('2020-01-01'),
        deadline: new Date('2020-01-11'),
        final_answer: null,
    };
    //이미 만들어진 worry 중 하나를 find하는 것
    // create 함수를 쓰게되면, worry를 생성해야하는 것이므로, 쓰이는 template 및 user 까지 create 해줘야 함
    prismaMock.worry.findUnique.mockResolvedValue(worry);
})

describe("[PUT] /review  리뷰 등록 및 수정", () => {

    describe("올바른 요청일 경우", () => {

        const DTO = {
            worryId: 1,
            userId: 1,
            review: "후기이이ㅣㅣㅣㅣㅣ~!",
        };
        const review = {
            worry_id: 1,
            user_id:3,
            content: "후기이이ㅣㅣㅣㅣㅣ~!",
            created_at: new Date(),
            updated_at: new Date()
        };
    
        // test("리뷰가 존재하지 않을 경우, 리뷰를 생성", async () => {
        //     prismaMock.review.findUnique.mockResolvedValue(null);
        //     prismaMock.review.create.mockResolvedValue(review);
        //     const moment = require('moment');
        //     const kst_updated_at = moment(review.updated_at).utc().utcOffset(9).format('YYYY-MM-DD');
            
        //     await expect(reviewService.patchReview(DTO)).resolves.toEqual({
        //         isNew: 1,
        //         result:{
        //             updatedAt: kst_updated_at
        //         }
        //     })

        // })

        test("리뷰가 존재할 경우, 리뷰를 수정", async () => {
            prismaMock.review.findUnique.mockResolvedValue(review);
            prismaMock.review.update.mockResolvedValue(review);
            const moment = require('moment');
            const kst_updated_at = moment(review.updated_at).utc().utcOffset(9).format('YYYY-MM-DD');
            
            await expect(reviewService.patchReview(DTO)).resolves.toEqual({
                isNew: 0,
                result:{
                    updatedAt: kst_updated_at
                }
            })

        })    
    })

    // describe("잘못된 요청일 경우", () => {

        // const invalidWorryId = {
        //     worryId: -1,              // invalid worryId
        //     userId:1,
        //     review: "후기이이ㅣㅣㅣㅣㅣ~!",
        // };

        // test("req.body로 받아온 worryId가 잘못된 경우 에러 반환", async () => {
        //     await expect(reviewService.putReview(invalidWorryId)).rejects.toThrowError(
        //         "해당 worryId의 고민글이 존재하지 않습니다."
        //     )
        // })

        // const invalidUserId = {
        //     worryId: 1,              
        //     userId:-1,                       // invalid userId
        //     review: "후기이이ㅣㅣㅣㅣㅣ~!",
        // };
        // test("해당 고민글 작성자가 아닌 경우 에러 반환", async () => {
        //     await expect(reviewService.putReview(invalidUserId)).rejects.toThrowError(
        //         "고민글 작성자만 리뷰를 등록/수정할 수 있습니다."
        //     )


        // })

    // })

})
