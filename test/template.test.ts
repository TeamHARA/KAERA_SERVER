import { prismaMock } from './singleton';
import templateService from "../src/service/templateService";
import templateRepository from '../src/repository/templateRepository';
import { userService } from '../src/service';


// test('should read all templates ', async () => {
  
//   const newUser = {
//     name: 'Rich',
//     email: 'hello@prisma.io',
//     kakaoId: 2020200,
//     appleId: "apple_id",
//     ageRange: "20~29",
//     gender: "male",
//     refreshToken: "refresh_token",
//     deviceToken: "device_token",
//   }

//   const createdNewUser = {
//     id:1,
//     ...newUser,
//     used_template:[1,2],
//     created_at: new Date(),
//     updated_at: new Date(),
//     kakao_id: BigInt(2020200),
//     apple_id: "apple_id",
//     age_range: "20~29",
//     gender: "male"
//   }

//   // mock으로 가짜 유저 생성
//   prismaMock.user.create.mockResolvedValue(createdNewUser);


//   const templates = [
//     {
//       id: 1,
//       info: "template_1_info",
//       title: "template_1_title",
//       shortInfo: "emplate_1_shortInfo",
//       questions: ["질문1", "질문2","질문3"],
//       guideline: "template_1_guideline",
//       hints: ["힌트1", "힌트2","힌트3"],
//       subtitles: ["소제목1", "소제목2","소제목3"]
//     },
//     {
//       id: 2,
//       info: "template_2_info",
//       title: "template_2_title",
//       shortInfo: "emplate_2_shortInfo",
//       questions: ["질문1", "질문2","질문3"],
//       guideline: "template_2_guideline",
//       hints: ["힌트1", "힌트2","힌트3"],
//       subtitles: ["소제목1", "소제목2","소제목3"]
//     }
//   ]
//   (templateRepository.findAllTemplate as jest.Mock).mockResolvedValue(templates);

//   const result = [
//     {
//       templateId: templates[0].id,
//       title: templates[0].title,
//       shortInfo: templates[0].shortInfo,
//       info: templates[0].info,
//       hasUsed: createdNewUser.used_template.includes(templates[0].id),
//     },
//     {
//       templateId: templates[1].id,
//       title: templates[1].title,
//       shortInfo: templates[1].shortInfo,
//       info: templates[1].info,
//       hasUsed: createdNewUser.used_template.includes(templates[1].id),
//     }
//   ]
  
//   await expect(templateRepository.findAllTemplate()).resolves.toEqual(templates);
//   await expect(templateService.getAllTemplate(createdNewUser.id)).resolves.toEqual(result);
      
// })

describe('getAllTemplate', () => {
  it('should return all templates with hasUsed flag', async () => {
    const mockTemplates = [
      {
        id: 1,
        info: "template_1_info",
        title: "template_1_title",
        shortInfo: "emplate_1_shortInfo",
        questions: ["질문1", "질문2","질문3"],
        guideline: "template_1_guideline",
        hints: ["힌트1", "힌트2","힌트3"],
        subtitles: ["소제목1", "소제목2","소제목3"]
      },
      {
        id: 2,
        info: "template_2_info",
        title: "template_2_title",
        shortInfo: "emplate_2_shortInfo",
        questions: ["질문1", "질문2","질문3"],
        guideline: "template_2_guideline",
        hints: ["힌트1", "힌트2","힌트3"],
        subtitles: ["소제목1", "소제목2","소제목3"]
      }
    ];
    const mockUser = {
      id:1,
      name: "user",
      email: "email@prisma.io",
      used_template:[1,2],
      created_at: new Date(),
      updated_at: new Date(),
      kakao_id: BigInt(2020200),
      apple_id: "apple_id",
      age_range: "20~29",
      gender: "male"
    };

    // Mock repository behavior
    jest.spyOn(templateRepository, 'findAllTemplate').mockResolvedValue(mockTemplates);
    
    // Mock service behavior
    jest.spyOn(userService, 'getUserById').mockResolvedValue(mockUser);

    const result = await templateService.getAllTemplate(1);

    expect(result).toEqual([
      {
        templateId: mockTemplates[0].id,
        title: mockTemplates[0].title,
        shortInfo: mockTemplates[0].shortInfo,
        info: mockTemplates[0].info,
        hasUsed: true 
      },
      {
        templateId: mockTemplates[1].id,
        title: mockTemplates[1].title,
        shortInfo: mockTemplates[1].shortInfo,
        info: mockTemplates[1].info,
        hasUsed: true
      }
    ]);
  });



});
