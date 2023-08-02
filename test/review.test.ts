import { prismaMock } from './singleton';
import  reviewService  from '../src/service/reviewService';

describe("[PUT] /review  리뷰 등록 및 수정", () => {
    
    describe("올바른 요청일 경우", () => {
        // valid한 worryId == 5
        beforeEach(async () => {
            const worry = {
                id: 5,
                template_id: 2,
                user_id: 5,
                title: 'test~!~!~!',
                answers: ['답변1','답변2','답변3'],
                created_at: new Date('2020-01-01'),
                updated_at: new Date('2020-01-01'),
                deadline: new Date('2020-01-11'),
                final_answer: null,
            };
            
            prismaMock.worry.findUnique.mockResolvedValue(worry);
        })
        
        const DTO = {
            worryId: 5,
            review: "후기이이ㅣㅣㅣㅣㅣ~!",
        };
        const review = {
            worry_id: 5,
            content: "후기이이ㅣㅣㅣㅣㅣ~!",
            created_at: new Date(),
            updated_at: new Date()
        };
    
        test("리뷰가 존재하지 않을 경우, 리뷰를 생성", async () => {
            prismaMock.review.findUnique.mockResolvedValue(null);
            prismaMock.review.create.mockResolvedValue(review);

            await expect(reviewService.putReview(DTO)).resolves.toEqual(undefined)

        })

        test("리뷰가 존재할 경우, 리뷰를 수정", async () => {
            prismaMock.review.findUnique.mockResolvedValue(review);
            prismaMock.review.update.mockResolvedValue(review);
            const moment = require('moment');
            const kst_updated_at = moment(review.updated_at).utc().utcOffset(9).format('YYYY-MM-DD');
            await expect(reviewService.putReview(DTO)).resolves.toEqual({
                updatedAt: kst_updated_at
            })

        })    
    })

    describe("잘못된 요청일 경우", () => {
        const invalidDTO = {
            worryId: 5,              // invalid worryId
            review: "후기이이ㅣㅣㅣㅣㅣ~!",
        };
        test("req.body로 받아온 worryId가 잘못된 경우 에러 반환", async () => {
            await expect(reviewService.putReview(invalidDTO)).rejects.toThrowError(
               "해당 worryId의 고민글이 존재하지 않습니다."
            )


        })
    })

})
