import worryRepository from "../repository/worryRepository";
import { tokenRepository } from "../repository";

const getUserListByDeadline =async (date: Date) => {

    const data = await worryRepository.findUserListByDeadline(date);
    if(data.length == 0){
        return null;
    }

    const result :Array<any> = [];
    for (var i =0;i<data.length;i++){
        if(data[i].user.token?.device_token != "")
            result.push({
                worryId: data[i].id,
                deviceToken: data[i].user.token?.device_token
            })
    }

    return result;

}

const getUserListWithNoDeadline =async (date: string) => {

    const data:any = await worryRepository.findUserListWithNoDeadline(date);

    if(data.length == 0){
        return null;
    }
    
    const user_ids :Array<number> = [];
    for (var i =0;i<data.length;i++){
        user_ids.push(data[i].user_id);
    }

    const token = await tokenRepository.findDeviceTokenListByIds(user_ids);
    const user_deviceTokens :Array<string|null>  = [];
    for (var i =0;i<token.length;i++){
        if(token[i].device_token != "")
            user_deviceTokens.push(token[i].device_token)
    }

    return user_deviceTokens;
}

export default{
    getUserListByDeadline,
    getUserListWithNoDeadline
}