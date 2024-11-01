import { NextFunction, Request, Response } from "express";
import admin from '../modules/firebaseAdmin';
import { userService } from "../service";
import tokenService from "../service/tokenService";
import moment from "moment";
import alarmService from "../service/alarmService";
import { alarm, rm, sc } from "../constants";
import { fail, success } from "../constants/response";
import statusCode from "../constants/statusCode"
import worryService from "../service/worryService";
import { worryCreateDTO } from "../interfaces/DTO/worryDTO";


const serviceEndAlarm = async () => {
    try {
        // const userIds = await userService.getAllUser();
        const userIds = [25]

        const title = "캐라 서비스 종료 안내"
        const msg = ["안녕하세요, 캐라(Kaera) 서비스가 2024년 11월 11일 종료됩니다. 데이터는 종료 후 2개월간 보관되며 이후에는 완전히 파기될 예정입니다. 그동안 캐라(Kaera)를 사랑해 주셔서 감사합니다."]
        const contents = "안녕하세요, 캐라(Kaera) 서비스가 2024년 11월 11일 종료됩니다. 데이터는 종료 후 2개월간 보관되며 이후에는 완전히 파기될 예정입니다. 감사합니다."
          
        for (let i = 0; i < userIds.length; i++) {
            const worryCreateDTO: worryCreateDTO = {
                templateId: 1,
                userId: userIds[i],
                title: title,
                answers: msg,
                deadline: -888
            }

            const postedWorry = await worryService.postWorry(worryCreateDTO)
            const token = await tokenService.getDeviceToken(userIds[i])
            const data = {
                "payload": postedWorry.worryId,
                "title": title,
                "contents": contents,
                "deviceToken": token
            }

            pushAlarmWithPayload(data);

        }


    }catch (error) {
        console.log(error);
        // next(error);
    }

}
const setFinishedAlarm = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { templateId, userId } = req.body;

        const user = await userService.getUserById(userId);
        const userName = user.name;
        const token = await tokenService.getDeviceToken(userId);

        const title = alarm.FINISHED_ALARM_TITLE;
        let msg = `${userName}님은 `;
        if (templateId == 1) {
            msg += alarm.FINISHED_ALARM_1
        }
        if (templateId == 2) {
            msg += alarm.FINISHED_ALARM_2
        }
        if (templateId == 3) {
            msg += alarm.FINISHED_ALARM_3
        }
        if (templateId == 4) {
            msg += alarm.FINISHED_ALARM_4
        }
        if (templateId == 5) {
            msg += alarm.FINISHED_ALARM_5
        }
        if (templateId == 6) {
            msg += alarm.FINISHED_ALARM_6
        }

        const data = {
            "title": title,
            "contents": msg,
            "deviceToken": token
        }

        pushAlarm(data, next);

    } catch (error) {
        next(error);
    }
}

const setOnDeadlineAlarm = async () => {
    try {
        const today = moment().format('YYYY-MM-DD');
        const user = await alarmService.getUserListByDeadline(new Date(today));
        if (!user) {
            return;
        }

        for (var i = 0; i < user.length; i++) {
            const data = {
                "payload": user[i].worryId,
                "title": alarm.DEADLINE_ALARM_TITLE,
                "contents": alarm.ON_DEADLINE_ALARM,
                "deviceToken": user[i].deviceToken
            }
            pushAlarmWithPayload(data);
        }

    } catch (error) {
        console.log(error)
    }
}

const setBeforeDeadlineAlarm = async () => {
    try {
        const deadline = moment().add(3, "days").format('YYYY-MM-DD');
        const user = await alarmService.getUserListByDeadline(new Date(deadline));
        if (!user) {
            return;
        }

        for (var i = 0; i < user.length; i++) {
            const data = {
                "payload": user[i].worryId,
                "title": alarm.DEADLINE_ALARM_TITLE,
                "contents": alarm.BEFORE_DEADLINE_ALARM,
                "deviceToken": user[i].deviceToken
            }
            pushAlarmWithPayload(data);
        }

    } catch (error) {
        console.log(error)
    }
}

const setNoDeadlineAlarm = async () => {
    try {
        const createdAt = moment().subtract(30, "days").format('YYYY-MM-DD');
        const user = await alarmService.getUserListWithNoDeadline(createdAt);
        if (!user) {
            return;
        }

        for (var i = 0; i < user.length; i++) {
            const data = {
                "payload": user[i].worryId,
                "title": alarm.NO_DEADLINE_ALARM_TITLE,
                "contents": alarm.NO_DEADLINE_ALARM,
                "deviceToken": user[i].deviceToken
            }
            pushAlarmWithPayload(data);
        }

    } catch (error) {
        console.log(error)
    }
}

const pushAlarm = (data: any, next: NextFunction) => {
    try {
        const { deviceToken, title, contents } = data;

        let message = {
            token: deviceToken,
            notification: {
                title: title,
                body: contents,
            }
        }

        admin
            .messaging()
            .send(message)
            .then(function (response: Response) {
                console.log('Successfully sent message: : ', response)
                // return res.status(200).json({success : true})
            })
            .catch(function (err: Error) {
                console.log('Error Sending message!!! : ', err)
                // return res.status(400).json({success : false})
            });
    } catch (error) {
        next(error)
    }

}

const pushAlarmWithPayload = (data: any) => {
    try {
        const { payload, deviceToken, title, contents } = data;

        // data must only contain string values
        let message = {
            token: deviceToken,
            notification: {
                title: title,
                body: contents,
            },
            data: {
                worryId: String(payload)
            }
        }

        admin
            .messaging()
            .send(message)
            .then(function (response: Response) {
                console.log('Successfully sent message: : ', response)
                // return res.status(200).json({success : true})
            })
            .catch(function (err: Error) {
                console.log('Error Sending message!!! : ', err)
                // return res.status(400).json({success : false})
            });
    } catch (error) {
        console.log(error)
    }

}

const pushAlarmToManyWithPayload = async (data: any) => {
    try {
        const { payload, deviceTokens, title, contents } = data;
       
        let message = {
            notification: {
                title: title,
                body: contents,
            },
            data: {
                worryId: String(payload)
            },
            tokens: deviceTokens,
        };

        admin
            .messaging()
            .sendMulticast(message)
            .then(function (response: Response) {
                console.log('Successfully sent messages');
                // return res.status(200).json({success : true})
            })
            .catch(function (err: Error) {
                console.log('Error Sending message!!! : ', err)
                // return res.status(400).json({success : false})
            });
    } catch (error) {
        console.log(error);
    }

}

const settingAlarm = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { isTrue } = req.params
        const { userId, deviceToken } = req.body

        const data = await tokenService.getDeviceToken(userId)
        // 알람 비활성화 상태에서 알람 비활성화하려 할 때
        if (data == "" && +isTrue == 0) {
            return res.status(sc.OK).send(success(statusCode.OK, rm.ALARM_DISABLE_SUCCESS))
        }
        // 알람 활성화 상태에서 알람 활성화하려 할 때
        if (data != "" && +isTrue == 1) {
            return res.status(sc.OK).send(success(statusCode.OK, rm.ALARM_ENABLE_SUCCESS));
        }

        if (+isTrue == 1) {
            await tokenService.setDeviceToken(userId, deviceToken)
            return res.status(sc.OK).send(success(statusCode.OK, rm.ALARM_ENABLE_SUCCESS));

        }
        if (+isTrue == 0) {
            await tokenService.disableDeviceToken(userId, deviceToken)
            return res.status(sc.OK).send(success(statusCode.OK, rm.ALARM_DISABLE_SUCCESS));
        }


    } catch (error) {
        next(error);
    }
}


export default {
    setFinishedAlarm,
    setOnDeadlineAlarm,
    setBeforeDeadlineAlarm,
    setNoDeadlineAlarm,
    pushAlarm,
    pushAlarmWithPayload,
    settingAlarm,
    serviceEndAlarm
}