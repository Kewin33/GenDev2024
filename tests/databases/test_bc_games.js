import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

async function getGamesByTeam(team){
    let user = await prisma.bc_game.findMany({
        where: { OR: [
                {team_away: team},
                {team_home: team}
            ] }
    });
    console.log(user);
    await prisma.$disconnect();
    return user;
}

//let date = new Date("2024-06-24T19:00:00.000Z");
await getGamesByTeam("Bayern München")