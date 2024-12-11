import {PrismaClient} from '@prisma/client'

// version 1


// making a database request that returns all games a team is going to play
// @param = name of the team
// @returns = array of game objects
// @test
// console.log(await getGameIdByTeamName('Deutschland'));
export async function getGamesByTeamName(teamName){
    let prisma = new PrismaClient()
    let gameIdArray = await prisma.bc_game.findMany({
        where: {
            OR: [
                {team_home : teamName},
                {team_away : teamName}
            ]
        }
    })
    await prisma.$disconnect();
    return gameIdArray;
}



export async function getStreamingIdsByGameId(gameId){
    let prisma = new PrismaClient()
    let streamingIdArray = prisma.bc_streaming_offer.findMany({
        where: {
            AND: [
                {game_id : gameId},
                {live : 1}
            ]
        }
    })
    await prisma.$disconnect();
    return streamingIdArray;
}

//console.log(await getStreamingIdsByGameId(8533));

export async function getAllStreamingIds(){
    let prisma = new PrismaClient()
    let streamingIds = await prisma.bc_streaming_package.findMany({})
    await prisma.$disconnect();
    return streamingIds;
}

//console.log(await getGameIdsByStreamingId(2));


 //version 2
export async function getGameIdsByStreamingId(streamingId){
    let prisma = new PrismaClient()
    let streamingIdArray = await prisma.bc_streaming_offer.findMany({
        where:{
            AND: [
                {streaming_package_id : streamingId},
                {live : 1}
            ]
        }
    })
    prisma.$disconnect();
    return streamingIdArray;
}

export async function getGamesByIdAndTeam(id,teamName){
    let prisma = new PrismaClient()
    let gameIdArray = await prisma.bc_game.findMany({
        where: {
            AND: [
                {id:id},
                {
                    OR: [
                        {team_home : teamName},
                        {team_away : teamName}
                    ]
                }
            ]

        }
    })
    await prisma.$disconnect();
    return gameIdArray;
}


// version 3
//export async function

async function getGamesByTeamAndStreamingPackageHelper(team, streamingPackage){
    const prisma = new PrismaClient();
    let games = await prisma.bc_game.findMany({
        where: {
            OR: [
                { team_home: team },
                { team_away: team }
            ],
            bc_streaming_offer: {
                some: {
                    streaming_package_id: streamingPackage
                }
            },
        },
        select: {
            id: true,
            bc_streaming_offer: {
                select: {
                    streaming_package_id: true,

                }
            }
        }
    });
    await prisma.$disconnect()
    return games
}


export async function getGamesByTeamAndStreamingPackage(team, streamingPackage){
    let games = await getGamesByTeamAndStreamingPackageHelper(team, streamingPackage)
    return games.map(game => ({
        ...game,
        bc_streaming_offer: game.bc_streaming_offer.map(offer => offer.streaming_package_id) // Nur die Zahlen werden extrahiert
    }));
}


//console.log(await getGamesByTeamAndStreamingPackage('Schweiz', 2));
/*
From bc_game, bc_streaming_offer, streaming_package
SELECT bc_games.id,bc_streaming_package.id, streaming_package.monthly_price_cents,bc_streaming_package.monthly_price_yearly_subscription_in_cents
WHERE bc_game.id = bc_streaming_offer.id AND
    bc_streaming_package.id = bc_streaming_offer.streaming_package_id AND
    team_home = team AND
    team_away = team

 */

let  prisma = new PrismaClient()
const result = await prisma.bc_streaming_package.findMany({
    select: {
        id: true, // streaming_package_id
        monthly_price_cents: true,
        monthly_price_yearly_subscription_in_cents: true,
        bc_streaming_offer: {
            select: {
                game: {
                    where: {
                        team_home: 'Schweiz'
                    },
                    select: {
                        id: true // game.id
                    }
                }
            }
        }
    }
});

// Formatiere die Ergebnisse so, dass ein Array von Objekten zurückgegeben wird
const formattedResult = result.map(packages => ({
    streaming_package_id: packages.id,
    monthly_price_cents: packages.monthly_price_cents,
    monthly_price_yearly_subscription_in_cents: packages.monthly_price_yearly_subscription_in_cents,
    games: packages.bc_streaming_offer.map(offer => offer.game.id) // Array von game.id
}));

//console.log(formattedResult);

