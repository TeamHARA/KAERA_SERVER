import { ClientException } from "../common/error/exceptions/customExceptions";
import { rm } from "../constants";
import reviewRepository from "../repository/reviewRepository";
import { reviewDTO } from "../interfaces/DTO/reviewDTO"
import worryRepository from "../repository/worryRepository";

const putReview = async (reviewDTO: reviewDTO) => {
    console.log(reviewDTO.worryId)
    const worry = await worryRepository.findWorryById(reviewDTO.worryId);
    if(reviewDTO.worryId == -1)
        console.log("worry: ", worry)
        console.log("shit")
    if(!worry){
        console.log("dudlddl")
        throw new ClientException("해당 worryId의 고민글이 존재하지 않습니다.");
    }

    if(worry.user_id != reviewDTO.userId){
        throw new ClientException("고민글 작성자만 리뷰를 등록/수정할 수 있습니다.");
    }
    console.log("ddpdp")

    const exists = await reviewRepository.findreviewById(reviewDTO.worryId);
    let review;
    if (!exists) {
        review = await reviewRepository.createReview(reviewDTO);
        if (!review) {
            throw new ClientException(rm.CREATE_REVIEW_FAIL);
        }
        return;
    }
    
    review = await reviewRepository.updateReview(reviewDTO);
    if (!review) {
        throw new ClientException(rm.UPDATE_REVIEW_FAIL);
    }
    
    const moment = require('moment');
    const kst_updated_at = moment(review.updated_at).utc().utcOffset(9).format('YYYY-MM-DD');

    const data = {
        updatedAt: kst_updated_at
    }
    return data;

}


export default {
    putReview
}