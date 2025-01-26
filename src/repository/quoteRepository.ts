import prisma from "../../prisma/prismaClient";


const findAllQuote = async () => {
    return await prisma.quote.findMany({
        select: {
            id: true,
            content: true,
        }
    });
};

export default{
    findAllQuote
}