import worryRepository from "../repository/worryRepository";
import { tokenRepository } from "../repository";

const getUserListByDeadline =async (date: Date) => {

    const data = await worryRepository.findUserListByDeadline(date);
          
    const user_ids :Array<number> = [];
    for (var i =0;i<data.length;i++){
        user_ids.push(data[i].user_id);
    }

    const token = await tokenRepository.findDeviceTokenListByIds(user_ids);
    const user_deviceTokens :Array<string|null>  = [];
    for (var i =0;i<token.length;i++){
        user_deviceTokens.push(token[i].device_token);
    }

    return user_deviceTokens;
}

export default{
    getUserListByDeadline
}