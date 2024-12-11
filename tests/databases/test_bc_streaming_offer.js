import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

async function getGamesByStreamingId(id){
    let user = await prisma.bc_streaming_offer.findMany({
        where: { streaming_package_id:id}
    });
    console.log(user);
    await prisma.$disconnect();
    return user;
}

await getGamesByStreamingId(1)