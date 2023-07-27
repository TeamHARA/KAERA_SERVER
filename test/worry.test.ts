import request from "supertest"
import testApp from "./testApp";
import { prismaMock } from './singleton';
import worryService from "../src/service/worryService";
import worryRepository from "../src/repository/worryRepository";


describe("[POST] /worry", () => {

  test("should save worry to the database", async () => {
    
    const dto = {
        "templateId": 1,
        "userId": 5,
        "title": 'test~!~!~!',
        "answers": ['답변1','답변2','답변3'],
        "deadline": -1
    }

    const worry = {
      id: 100,
      template_id: dto.templateId,
      user_id: 5,
      title: dto.title,
      answers: dto.answers,
      created_at: new Date(),
      updated_at: new Date(),
      deadline: new Date('2020-01-11'),
      final_answer: null,
    };
 
    prismaMock.worry.create.mockResolvedValue(worry);
    prismaMock.worry.findUnique.mockResolvedValue(worry);
    const data = await worryRepository.findWorryById(100)
    const created = await worryService.postWorry(dto);
    console.log(data)
    // console.log(created)
    // console.log(new Date('2020-01-01'))




  })



})