interface worryCreateDTO {
  templateId: number;
  userId: number;
  title: string;
  answers: Array<string>;
  deadline: number;
}

interface worryUpdateDTO{
  worryId: number;
  title: string;
  answers: Array<string>;
}

export {
  worryCreateDTO,
  worryUpdateDTO
}


