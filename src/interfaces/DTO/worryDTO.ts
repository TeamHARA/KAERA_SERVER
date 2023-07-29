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

interface makeFinalAnswerDTO{
  worryId: number;
  userId: number;
  finalAnswer: string;
}

export {
  worryCreateDTO,
  worryUpdateDTO,
  makeFinalAnswerDTO
}


