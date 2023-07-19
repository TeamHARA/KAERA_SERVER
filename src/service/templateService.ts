import { ClientException } from "../common/error/exceptions/customExceptions";
import { rm } from "../constants";
import templateRepository from "../repository/templateRepository";

const getTemplateById =async (templateId: number) => {
    const template = await templateRepository.findTemplateById(templateId);
 
    if (!template) {
        throw new ClientException(rm.NO_TEMPLATE);
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

export default{
    getTemplateById,
}