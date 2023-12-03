import { NextFunction, Request, Response } from "express";

const admin = require('firebase-admin');
let serviceAccount = require("../../firebase-admin.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const pushAlarm = (req: Request, res: Response, next: NextFunction) => {
    try{
        const { deviceToken } = req.body;

        let message = {
            notification: {
            title: '테스트 발송',
            body: '우와~!!!!!!',
            },
            token: deviceToken,
        }

        admin
            .messaging()
            .send(message)
            .then(function (response:Response) {
            console.log('Successfully sent message: : ', response)
            return res.status(200).json({success : true})
            })
            .catch(function (err:Error) {
                console.log('Error Sending message!!! : ', err)
                return res.status(400).json({success : false})
            });
    } catch (error) {
        next(error);
    }

}

export default{
    pushAlarm
}