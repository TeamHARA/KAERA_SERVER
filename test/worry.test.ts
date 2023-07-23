import request from "supertest"
import testApp from "./testApp";
import { prismaMock } from './singleton';
import worryController from '../src/controller/worryController';



describe("[POST] /worry", () => {

  // test("should save worry to the database", async () => {
    
  //   const body = {
  //       "templateId": 1,
  //       "userId": 5,
  //       "title": '제목',
  //       "answers": ['답변1','답변2','답변3'],
  //       "deadline": 5
  //   }

  //   const worry = {
  //     id: 100,
  //     template_id: 1,
  //     user_id: 5,
  //     title: '제목',
  //     answers: ['답변1','답변2','답변3'],
  //     created_at: new Date(),
  //     updated_at: new Date(),
  //     deadline: new Date('2023-07-22'),
  //     final_answer: null,
  //   };
  //   prismaMock.worry.create.mockResolvedValue(worry);


  //   const mockResponse = {
  //       "status": 200,
  //       "success": true,
  //       "message": "고민 생성 성공",
  //       "data": {
  //         "createdAt": "2023-07-23"
  //       }
  //   }


  // })

  test("router test by using supertest", async () => {
    const response = await request(testApp).post("/worry").send({
      "templateId": 1,
      "userId": 5,
      "title": '제목',
      "answers": ['답변1','답변2','답변3'],
      "deadline": 5
    });
    expect(response.statusCode).toBe(404);
  })

})