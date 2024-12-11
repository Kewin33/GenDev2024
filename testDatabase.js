import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

async function getUserById(id){
    let user = await prisma.users.findUnique({where: { id: id } },);
    console.log(user);
    await prisma.$disconnect();
    return user;

}

await getUserById(2);