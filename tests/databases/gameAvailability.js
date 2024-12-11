import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function gameAvailability(streamingId, teamName) {
    const res = await prisma.bc_streaming_offer.findMany({
        where: {
            streaming_package_id: streamingId,
            live: 1, // Filter for live streaming offers
            game: {
                OR: [
                    { team_home: teamName },
                    { team_away: teamName }
                ]
            }
        },
        select: {
            game: {
                select: {
                    team_home: true,
                    team_away: true
                }
            }
        }
    });

    await prisma.$disconnect(); // Ensure the connection is closed after the query
    return res;
}

// Call the function and log the result
gameAvailability(17, "Bayern München")
    .then(res => console.log(res))
    .catch(err => console.error(err));
