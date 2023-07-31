interface worryCreateDTO {
  templateId: number;
  userId: number;
  title: string;
  answers: Array<string>;
  deadline: number;
}

interface worryUpdateDTO{
  worryId: number;
  userId: number;
  title: string;
  answers: Array<string>;
}

interface finalAnswerCreateDTO{
  worryId: number;
  userId: number;
  finalAnswer: string;
}

interface deadlineUpdateDTO{
  worryId: number;
  userId: number;
  dayCount: number;
}

export {
  worryCreateDTO,
  worryUpdateDTO,
  finalAnswerCreateDTO,
  deadlineUpdateDTO
}


