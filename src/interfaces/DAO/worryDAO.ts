import { finalAnswerCreateDTO, worryCreateDTO } from "../DTO/worryDTO";

interface worryCreateDAO extends worryCreateDTO{
    deadlineDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
  

interface deadlineUpdateDAO{
  worryId: number;
  deadline: Date | null;
}

interface deadlineUpdateDAO{
  worryId: number;
  deadline: Date | null;
}

interface finalAnswerCreateDAO extends finalAnswerCreateDTO{
  templateId: number;
}
  
export {
  worryCreateDAO,
  deadlineUpdateDAO,
  finalAnswerCreateDAO
}