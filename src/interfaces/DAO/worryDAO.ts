import { worryCreateDTO } from "../DTO/worryDTO";

interface worryCreateDAO extends worryCreateDTO{
    deadlineDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
  
interface worryUpdateDAO{
worryId: number;
title: string;
answers: Array<string>;
}
  
  export {
    worryCreateDAO,
    worryUpdateDAO
  }