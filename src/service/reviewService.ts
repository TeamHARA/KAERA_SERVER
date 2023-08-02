import { ClientException } from "../common/error/exceptions/customExceptions";
import { rm } from "../constants";
import reviewRepository from "../repository/reviewRepository";
import { reviewDTO } from "../interfaces/DTO/reviewDTO"

const putReview = async (reviewDTO: reviewDTO) => {

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