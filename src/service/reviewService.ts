import { ClientException, ServerException } from "../common/error/exceptions/customExceptions";
import { rm } from "../constants";
import reviewRepository from "../repository/reviewRepository";
import { reviewDTO } from "../interfaces/DTO/reviewDTO"
import worryRepository from "../repository/worryRepository";

const patchReview = async (reviewDTO: reviewDTO) => {

    try{
        const worry = await worryRepository.findWorryById(reviewDTO.worryId);

        if(!worry){
            throw new ClientException("해당 worryId의 고민글이 존재하지 않습니다.");
        }

        if(worry.user_id != reviewDTO.userId){
            throw new ClientException("고민글 작성자만 리뷰를 등록/수정할 수 있습니다.");
        }

        const review = await reviewRepository.findreviewById(reviewDTO.worryId);
        let newReview;
        let isNew = 0;
        if (!review) {
            newReview = await reviewRepository.createReview(reviewDTO);
            if (!newReview) {
                throw new ClientException(rm.CREATE_REVIEW_FAIL);
            }
            isNew = 1
        }
        
        else{
            newReview = await reviewRepository.updateReview(reviewDTO);
            if (!newReview) {
                throw new ClientException(rm.UPDATE_REVIEW_FAIL);
            }
        }
        
        const moment = require('moment');
        const kst_updated_at = moment(newReview.updated_at).utc().utcOffset(9).format('YYYY-MM-DD');

        const result = {
            updatedAt: kst_updated_at
        }

        const data = {
            isNew,result
        }
        return data;
    }catch(error:any){
        throw new ServerException(rm.INTERNAL_SERVER_ERROR)
    }

}


export default {
    patchReview
}