import cron from 'node-cron';
import alarmController from '../controller/alarmController';

const option = {
    scheduled: true,
    timezone: "Asia/Seoul"
}
// 데드라인 3일 전 + 고민 작성 30일 후 : 오후 8시
const deadline_alarm_1 = cron.schedule('00 20 * * *', alarmController.setBeforeDeadlineAlarm, option);
const deadline_alarm_2 = cron.schedule('00 20 * * *', alarmController.setNoDeadlineAlarm, option);


// 데드라인 당일 알람 : 낮 12시
const deadline_alarm_3 = cron.schedule('00 12 * * *', alarmController.setOnDeadlineAlarm, option);

export default{
    deadline_alarm_1,
    deadline_alarm_2,
    deadline_alarm_3
}