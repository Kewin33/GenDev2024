import prisma, { PrismaClient } from "@prisma/client";

export async function availabilityDataForTable(gameIds, streamingPackageIds,notStreamedGames) {
    let prisma = new PrismaClient();

    // Fetch streaming package names for the given streamingPackageIds
    const streamingPackages = await prisma.bc_streaming_package.findMany({
        where: {
            id: { in: streamingPackageIds }
        },
        select: {
            id: true,
            name: true
        }
    });

    // Create a mapping of streamingPackageId to streamingPackageName
    const streamingPackageNames = streamingPackageIds.map(id => {
        const packageData = streamingPackages.find(pkg => pkg.id === id);
        return packageData ? packageData.name : null;
    });

    // Fetch the games and offers
    const games = await prisma.bc_game.findMany({
        where: {
            id: { in: gameIds },
            /*
            bc_streaming_offer: {
                some: {
                    streaming_package_id: { in: streamingPackageIds }
                }
            }
             */
        },
        select: {
            id: true,
            team_home: true,
            team_away: true,
            starts_at: true,
            tournament_name: true,
            bc_streaming_offer: {
                where: {
                    streaming_package_id: { in: streamingPackageIds }
                },
                select: {
                    live: true,
                    highlights: true,
                    streaming_package_id: true
                }
            }
        },
        orderBy: {
            tournament_name: 'asc',
        }
    });

    // Group games by tournament_name
    const groupedTournaments = games.reduce((acc, game) => {
        const liveHighlightsArray = streamingPackageIds.map(id => {
            const offer = game.bc_streaming_offer.find(offer => offer.streaming_package_id === id);
            if(notStreamedGames.includes(game.id)) {
                return {
                    live: -1,
                    highlights: -1
                };
            }
            return {
                live: offer ? offer.live : null,
                highlights: offer ? offer.highlights : null
            };
        });

        const subtournament = {
            id: game.id,
            team_home: game.team_home,
            team_away: game.team_away,
            starts_at: game.starts_at,
            liveHighlights: liveHighlightsArray
        };

        // Find if the tournament already exists in the accumulator
        let tournament = acc.find(t => t.tournament_name === game.tournament_name);
        if (!tournament) {
            tournament = {
                tournament_name: game.tournament_name,
                subCompetitions: []
            };
            acc.push(tournament);
        }

        // Add the subtournament to the current tournament
        tournament.subCompetitions.push(subtournament);
        tournament.subCompetitions.sort((a,b)=>new Date(a.starts_at) - new Date(b.starts_at))


        return acc;
    }, []);

    // Add the streamingPackageNames to the result
    return {
        competitionsData: groupedTournaments,
        streamingPackageNames: streamingPackageNames
    };
}


/*
let teams = ["Deutschland","Schweiz"]
let sid= [3,4]
let result = await availabilityDataForTable(teams, sid)
console.log(result.competitionsData[0].subCompetitions);

 */


