import prisma from "../../prisma/prismaClient";

const findTemplateById = async (templateId: number) => {
    return await prisma.template.findUnique({
        where: {
            id: templateId
        }
    });
};


const findAllTemplate = async () => {
    return await prisma.template.findMany({
        orderBy: {
            id: 'asc',   //id 기준 오름차순
          },
    });
};


export default{
    findTemplateById,
    findAllTemplate,
}