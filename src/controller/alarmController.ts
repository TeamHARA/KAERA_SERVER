import { NextFunction, Request, Response } from "express";
import admin from '../modules/firebaseAdmin';
import { userService } from "../service";
import tokenService from "../service/tokenService";
import { alarm } from "../constants";

const setFinishedAlarm = async(req: Request, res: Response, next: NextFunction) => {
    try{
        const { templateId, userId } = req.body;
        const user = await userService.getUserById(userId);
        const userName = user.name;
        const token = await tokenService.getDeviceToken(userId);

        const title = alarm.FINISHED_ALARM_TITLE;
        let msg = `${userName}님은 `;
        if (templateId == 1){
            msg += alarm.FINISHED_ALARM_1
        }
        if (templateId == 2){
            msg += alarm.FINISHED_ALARM_2
        }
        if (templateId == 3){
            msg += alarm.FINISHED_ALARM_3
        }
        if (templateId == 4){
            msg += alarm.FINISHED_ALARM_4
        }
        if (templateId == 5){
            msg += alarm.FINISHED_ALARM_5
        }
        if (templateId == 6){
            msg += alarm.FINISHED_ALARM_6
        }

        const data = {
            "title": title,
            "contents": msg,
            "deviceToken": token
        }
        // req.body.title = title;
        // req.body.contents = msg;
        // req.body.deviceToken = token;
        // next();

        pushAlarm(data,next);

    }catch (error) {
        next(error);
    }
}

const setDeadlineAlarm = async(req: Request, res: Response, next: NextFunction) => {
    try{



    }catch (error) {
        next(error);
    }
}

const pushAlarm = (data: any, next: NextFunction) => {
    try{
        const { deviceToken, title, contents } = data;
        let message = {
            notification: {
            title: title,
            body: contents,
            },
            token: deviceToken,
        }

        admin
            .messaging()
            .send(message)
            .then(function (response:Response) {
            console.log('Successfully sent message: : ', response)
            // return res.status(200).json({success : true})
            })
            .catch(function (err:Error) {
                console.log('Error Sending message!!! : ', err)
                // return res.status(400).json({success : false})
            });
    } catch (error) {
        next(error);
    }

}

export default{
    setFinishedAlarm,
    setDeadlineAlarm,
    pushAlarm
}