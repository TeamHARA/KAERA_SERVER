import request from "supertest"
import testApp from "./testApp";
import { prismaMock } from './singleton';
import worryService from "../src/service/worryService";
import worryRepository from "../src/repository/worryRepository";


describe("[POST] /worry", () => {

  test("should save worry to the database", async () => {
    
    // const dto = {
    //     templateId: 1,
    //     userId: 5,
    //     title: 'test~!~!~!',
    //     answers: ['답변1','답변2','답변3'],
    //     deadline: -1
    // }

    // mock db 에 생성된 worry   (service단에 짜놓은 로직에 따라 계산된 값들이 저장되어야 하는데 그냥 임의의 값들이 저장된 것)
    const worry = {
      id: 100,
      template_id: 2,
      user_id: 5,
      title: 'test~!~!~!',
      answers: ['답변1','답변2','답변3'],
      created_at: new Date('2020-01-01'),
      updated_at: new Date('2020-01-01'),
      deadline: new Date('2020-01-11'),
      final_answer: null,
    };
    prismaMock.worry.create.mockResolvedValue(worry);
    prismaMock.worry.findUnique.mockResolvedValue(worry);
    // const data = await worryRepository.findWorryById(100)
    // console.log(data)

    await expect(worryRepository.findWorryById(100)).resolves.toEqual({
      id: 100,
      template_id: 2,
      user_id: 5,
      title: 'test~!~!~!',
      answers: ['답변1','답변2','답변3'],
      created_at: new Date('2020-01-01'),
      updated_at: new Date('2020-01-01'),
      deadline: new Date('2020-01-11'),
      final_answer: null,
    })
    // const created = await worryService.postWorry(dto);
    // console.log(created)
    // console.log(new Date('2020-01-01'))

  
  
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