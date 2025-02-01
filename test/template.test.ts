import { prismaMock } from './singleton';
import templateService from "../src/service/templateService";
import templateRepository from '../src/repository/templateRepository';
import { userService } from '../src/service';
import { ClientException } from '../src/common/error/exceptions/customExceptions';


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


describe('getTemplateById', () => {
  afterEach(() => {
    // 각 테스트 후에 spyOn 리셋
    jest.restoreAllMocks();
  });

  it('should return template data when template exists', async () => {
    const mockTemplate = {
      id: 1,
      info: "template_1_info",
      title: "template_1_title",
      shortInfo: "emplate_1_shortInfo",
      questions: ["질문1", "질문2","질문3"],
      guideline: "template_1_guideline",
      hints: ["힌트1", "힌트2","힌트3"],
      subtitles: ["소제목1", "소제목2","소제목3"]
    }
    
    // Repository를 mock 처리
    prismaMock.template.findUnique.mockResolvedValue(mockTemplate);
    
    // Mock service behavior
    const data = {
      title: "template_1_title",
      guideline: "template_1_guideline",
      questions: ["질문1", "질문2","질문3"],
      hints: ["힌트1", "힌트2","힌트3"]
    }
    jest.spyOn(templateService, 'getTemplateById').mockResolvedValue(data);

    const result = await templateService.getTemplateById(1);
    expect(result).toEqual(data);

  });

  it('should throw ClientException when template is null', async () => {
    // Repository가 null 반환하도록 mock 처리
    prismaMock.template.findUnique.mockResolvedValue(null);
    await expect(templateService.getTemplateById(1)).rejects.toThrow(ClientException);
  });
});
