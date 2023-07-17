interface createWorryDTO {
  template_id: number;
  title: string;
  answers: Array<string>;
  deadline: number;
}

interface updateWorryDTO{
  worry_id: number;
  template_id: number;
  title: string;
  answers: Array<string>;
}

export {
  createWorryDTO,
  updateWorryDTO
}


