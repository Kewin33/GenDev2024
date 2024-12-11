import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

async function getServiceById(id){
    let user = await prisma.bc_streaming_package.findMany({
        where: { id : id }
    });
    console.log(user);
    await prisma.$disconnect();
    return user;
}

//let date = new Date("2024-06-24T19:00:00.000Z");
await getServiceById(1)