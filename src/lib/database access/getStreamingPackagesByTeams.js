import {PrismaClient} from '@prisma/client'
let prisma = new PrismaClient()

export async function getGamesByTeams(teams, timeFrom = null, timeUntil = null, preferredStreamingPackages = null, tournamentName = null) {
    // Initialisiere ein Set für die eindeutigen Spiel-IDs
    const res = new Set();
    //console.log(timeFrom, timeUntil, preferredStreamingPackages, tournamentName);
    for (let teamName of teams) {
        const gamesWithTeam = await prisma.bc_game.findMany({
            where: {
                OR: [
                    { team_home: teamName },
                    { team_away: teamName }
                ],
                ...(timeFrom && { starts_at: { gte: new Date(timeFrom) } }), // Optional: Zeitfilter von
                ...(timeUntil && { starts_at: { lte: new Date(timeUntil) } }), // Optional: Zeitfilter bis
                ...(preferredStreamingPackages && {
                    bc_streaming_offer: {
                        some: {
                            streaming_package: {
                                name: { in: preferredStreamingPackages }
                            }
                        }
                    }
                }), // Optional: Streaming-Pakete
                ...(tournamentName && { tournament_name: { in: tournamentName }}) // Optional: Turniername
            },
            select: {
                id: true // Spiel-ID zurückgeben
            }
        });

        // Füge die gefundenen Spiele zum Set hinzu
        gamesWithTeam.forEach(t => res.add(t.id));
    }

    // Rückgabe der einzigartigen Spiel-IDs als Array
    return Array.from(res);
}


export async function getStreamingPackagesByTeams(gameIds, preferredStreamingPackages) {
    console.time('getStreamingPackagesByTeams')

    //const gameIds = await getGamesByTeams(teams)
    //console.log(gameIds, preferredStreamingPackages);
    const result = await prisma.bc_streaming_package.findMany({
        where:{
            ...(preferredStreamingPackages && {name: {in: preferredStreamingPackages}}),
        },
        select: {
            id: true, // streaming_package_id
            monthly_price_cents: true,
            monthly_price_yearly_subscription_in_cents: true,
            bc_streaming_offer: {
                where: {
                    AND:[{
                        game_id: { in: gameIds },
                        live: 1
                    }]
                },
                select: {
                    game: {
                        select: {
                            id: true
                        }
                    }
                }
            }
        }
    });

// Formatiere die Ergebnisse
    /*
    let formattedResult = result.map(s => ({
        streaming_package_id: s.id,
        monthly_price_cents: s.monthly_price_cents,
        monthly_price_yearly_subscription_in_cents: s.monthly_price_yearly_subscription_in_cents,
        games: s.bc_streaming_offer.map(offer => offer.game.id) // Array von game.id
    }))
        .filter(f=> f.games.length !== 0);
     */
let formattedResult = result.map(s => ({
        id: s.id,
        weight: s.monthly_price_yearly_subscription_in_cents,
        gameIds: s.bc_streaming_offer.map(offer => offer.game.id) // Array von game.id
    }))
        .filter(f=> f.gameIds.length !== 0);

    //formattedResult = formattedResult.map()
    console.timeEnd('getStreamingPackagesByTeams')
    return formattedResult;
}

//console.log(await getStreamingPackagesByTeams(["Schweiz","Deutschland"]));