import worryRepository from "../repository/worryRepository";
import { tokenRepository } from "../repository";

const getUserListByDeadline =async (date: Date) => {

    const data = await worryRepository.findUserListByDeadline(date);
    if(data.length == 0){
        return null;
    }

    const result :Array<any> = [];
    for (var i =0;i<data.length;i++){
        result.push({
            worryId: data[i].id,
            deviceToken: data[i].user.token?.device_token
        })
    }

    return result;

}

const getUserListWithNoDeadline =async (date: string) => {
    console.log("created at:", date);

    const data:any = await worryRepository.findUserListWithNoDeadline(date);
    if(data.length == 0){
        return null;
    }
    
    const user_ids :Array<number> = [];
    for (var i =0;i<data.length;i++){
        user_ids.push(data[i].user_id);
    }

    console.log("user_ids:", user_ids);


    const token = await tokenRepository.findDeviceTokenListByIds(user_ids);
    const user_deviceTokens :Array<string|null>  = [];
    for (var i =0;i<token.length;i++){
        user_deviceTokens.push(token[i].device_token);
    }

    console.log("device token: ",user_deviceTokens);

    return user_deviceTokens;
}

export default{
    getUserListByDeadline,
    getUserListWithNoDeadline
}