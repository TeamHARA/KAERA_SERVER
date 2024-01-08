import worryRepository from "../repository/worryRepository";
import tokenService from "./tokenService";

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
    
    const result :Array<any> = [];
    for (var i =0;i<data.length;i++){
        const deviceToken = await tokenService.getDeviceToken(data[i].user_id)       
        if(deviceToken != ""){
            result.push({
                worryId: data[i].id,
                deviceToken: deviceToken
            })
        }
    }

    return result
}

export default{
    getUserListByDeadline,
    getUserListWithNoDeadline
}