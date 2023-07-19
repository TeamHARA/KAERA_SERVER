import prisma from "./prismaClient";

const findTemplateById = async (templateId: number) => {
    return await prisma.template.findUnique({
        where: {
            id: templateId
        }
    });
};

export default{
    findTemplateById,

}