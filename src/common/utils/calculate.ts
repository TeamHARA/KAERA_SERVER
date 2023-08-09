   
const calculate_d_day = (deadlineDate:Date|null) : number => {
    const moment = require('moment');
    //d-day 계산
    let gap = -888;                   // (데드라인 존재하지 않을 경우) : gap = -1
    if (deadlineDate != null){      // (데드라인 존재하는 경우) : gap = d-day에 해당하는 값
        const today = moment(moment().format('YYYY-MM-DD'));        // d-day 계산 (날짜 차이 계산을 위해 today 와 deadline을 moment 객체로 만들어줌)
        const deadline = moment(moment(deadlineDate).format('YYYY-MM-DD'));
        gap = today.diff(deadline, 'days')
    }

    return gap;
}  

const calculate_random_num = (max: number) : number => {

    return Math.floor(Math.random() * max);
      
}


export {
    calculate_d_day,
    calculate_random_num
}
   