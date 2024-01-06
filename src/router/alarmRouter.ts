import { Router } from "express";
import { auth } from "../middlewares";
import alarmController from "../controller/alarmController";

const router = Router();

router.post("/enable/:isTrue", 
    auth,
    alarmController.settingAlarm
)

export default router;