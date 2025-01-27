import { ClientException, ServerException } from "../common/error/exceptions/customExceptions";
import { rm , sc } from "../constants";
import templateRepository from "../repository/templateRepository";
import userService from "./userService";

const getTemplateById =async (templateId: number) => {
    try{
        const template = await templateRepository.findTemplateById(templateId);
        if(!template){
            console.log("template is null")
            throw new ClientException(rm.READ_TEMPLATE_FAIL)
        }
        const data = {
            title: template.title,
            guideline: template.guideline,
            questions: template.questions,
            hints: template.hints
        }
        return data;
    }catch(error:any){
        console.log(error)

        if(error.code == 'P2021'){
            throw new ServerException(rm.INTERNAL_SERVER_ERROR)
        }
        throw new ClientException(rm.READ_TEMPLATE_FAIL)

    }

}

const getAllTemplate =async (userId: number) => {
    try{
        const templates = await templateRepository.findAllTemplate();

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

    }catch(error){
        console.log(error)
        throw new ClientException(rm.READ_ALL_TEMPLATES_FAIL);
    }
}

export default{
    getTemplateById,
    getAllTemplate,
}