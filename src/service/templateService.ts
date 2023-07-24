import { ClientException } from "../common/error/exceptions/customExceptions";
import { rm } from "../constants";
import templateRepository from "../repository/templateRepository";
import userService from "./userService";

const getTemplateById =async (templateId: number) => {
    const template = await templateRepository.findTemplateById(templateId);
 
    if (!template) {
        throw new ClientException(rm.READ_TEMPLATE_FAIL);
    }

    const data = {
        title: template.title,
        info: template.info,
        guideline: template.guideline,
        questions: template.questions,
        hints: template.hints
    }
    return data;

}

const getAllTemplate =async (userId: number) => {

    const templates = await templateRepository.findAllTemplate();
    if (!templates) {
        throw new ClientException(rm.READ_ALL_TEMPLATES_FAIL);
    }

    const user = await userService.getUserById(userId);
    const usedTemplate = user.used_template;
    

    const data :Array<object> = [];
    for(var i=0;i<templates.length;i++){
        data.push({
            templateId: templates[i].id,
            title: templates[i].title,
            shortInfo: templates[i].shortInfo,
            info: templates[i].info,
            hasUsed: usedTemplate.includes(templates[i].id),
        })
    }

    return data;
}

export default{
    getTemplateById,
    getAllTemplate,
}