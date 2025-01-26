import { prismaMock } from './singleton';
import worryService from "../src/service/worryService";
import { worryCreateDTO } from "../src/interfaces/DTO/worryDTO";
import { worryCreateDAO } from "../src/interfaces/DAO/worryDAO";

import worryRepository from '../src/repository/worryRepository';


describe("[POST] /worry", () => {

  test("should save worry to the database", async () => {
    
    const newWorry: worryCreateDTO = {
      templateId: 2,
      userId: 5,
      title: 'new_worry',
      answers: ['답변1','답변2','답변3'],
      deadline: -888,
    };

    const newWorryDAO: worryCreateDAO = {
      ...newWorry,
      deadlineDate: null
  }

    const createdNewWorry = {
      id: 1,
      template_id: newWorry.templateId,
      user_id: newWorry.userId,
      title: newWorry.title,
      answers: newWorry.answers,
      created_at: new Date(),
      updated_at: new Date(),
      deadline: null,
      final_answer: null,
    }

    prismaMock.worry.create.mockResolvedValue(createdNewWorry);
    await expect(worryRepository.createWorry(newWorryDAO)).resolves.toEqual(createdNewWorry)
  
  })

  test("should calculate the deadline correct", async () => {
    const d_day = 11;
    const moment = require('moment');   
    const today = moment("2020-01-01");
    const deadline = today.add(d_day, 'days').format('YYYY-MM-DD');
    const deadlineDate = new Date(deadline).toISOString().substring(0,10);

    expect(deadlineDate).toEqual("2020-01-12");

  })



})