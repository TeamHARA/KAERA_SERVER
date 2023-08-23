import { worryCreateDTO } from "../DTO/worryDTO";

interface worryCreateDAO extends worryCreateDTO{
    deadlineDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
  

interface deadlineUpdateDAO{
  worryId?: number;
  deadline: Date | null;
}
  
export {
  worryCreateDAO,
  deadlineUpdateDAO
}