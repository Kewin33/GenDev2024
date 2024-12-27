import { PrismaClient } from "@prisma/client";

/**
 * Calculates the single ranking based on the request parameters.
 *
 * @param request {Object} The input parameters.
 * @returns {Promise<Object>} The calculated ranking data.
 */
export async function singleRanking(request) {
    console.time("singleRanking");

    // Check if all teams are selected
    if (request.teams[0] === "Alle ausgewählt") request.teams = null;

    const prisma = new PrismaClient();

    // Fetch total games involving specified teams
    const totalGames = await prisma.bc_game.findMany({
        select: { id: true },
        where: request.teams !== null
            ? {
                OR: [
                    ...request.teams.map(team => ({ team_home: team })),
                    ...request.teams.map(team => ({ team_away: team }))
                ]
            }
            : {}
    });

    // Fetch distinct streamed games for percentage calculations
    const allStreamedGames = await prisma.bc_game.findMany({
        where: {
            ...(request.teams?.length > 0 && {
                OR: [
                    ...request.teams.map(team => ({ team_home: team })),
                    ...request.teams.map(team => ({ team_away: team }))
                ]
            }),
            ...(request.timeFrom && { starts_at: { gte: new Date(request.timeFrom) } }),
            ...(request.timeUntil && { starts_at: { lte: new Date(request.timeUntil) } }),
            ...(request.tournamentName.length > 0 && { tournament_name: { in: request.tournamentName } }),
            bc_streaming_offer: {
                some: {
                    ...(request.live && { live: 1 }),
                    ...(request.highlight && { highlights: 1 }),
                }
            }
        },
        select: { id: true }
    });

    // Fetch all displayed games
    const allDisplayedGames = await prisma.bc_game.findMany({
        where: {
            ...(request.teams?.length > 0 && {
                OR: [
                    ...request.teams.map(team => ({ team_home: team })),
                    ...request.teams.map(team => ({ team_away: team }))
                ]
            }),
            ...(request.timeFrom && { starts_at: { gte: new Date(request.timeFrom) } }),
            ...(request.timeUntil && { starts_at: { lte: new Date(request.timeUntil) } }),
            ...(request.tournamentName.length > 0 && { tournament_name: { in: request.tournamentName } }),
        },
        select: { id: true }
    });

    const totalStreamedGamesCount = allStreamedGames.length;

    // Query streaming packages with related game details
    const result = await prisma.bc_streaming_package.findMany({
        select: {
            id: true,
            name: true,
            monthly_price_cents: true,
            monthly_price_yearly_subscription_in_cents: true,
            bc_streaming_offer: {
                where: {
                    game: {
                        ...(request.teams?.length > 0 && {
                            OR: [
                                ...request.teams.map(team => ({ team_home: team })),
                                ...request.teams.map(team => ({ team_away: team }))
                            ]
                        }),
                        ...(request.timeFrom && { starts_at: { gte: new Date(request.timeFrom) } }),
                        ...(request.timeUntil && { starts_at: { lte: new Date(request.timeUntil) } }),
                        ...(request.tournamentName.length > 0 && { tournament_name: { in: request.tournamentName } })
                    },
                    streaming_package: {
                        ...(request.preferredStreamingPackages.length > 0 && { name: { in: request.preferredStreamingPackages } })
                    },
                    ...(request.live && { live: 1 }),
                    ...(request.highlight && { highlights: 1 }),
                },
                select: {
                    game: { select: { id: true } }
                }
            }
        },
        orderBy: [
            { bc_streaming_offer: { _count: "desc" } },
            { monthly_price_cents: "asc" },
            { name: "asc" }
        ]
    });

    // Process the result to create the service ranking
    let service = result.map(pkg => {
        const streamedGames = pkg.bc_streaming_offer.map(offer => offer.game.id);
        const weight = [
            pkg.monthly_price_cents || pkg.monthly_price_yearly_subscription_in_cents,
            pkg.monthly_price_yearly_subscription_in_cents,
            Math.min(pkg.monthly_price_cents || pkg.monthly_price_yearly_subscription_in_cents, pkg.monthly_price_yearly_subscription_in_cents)
        ][request.abo];

        const percentageAllGames = totalGames.length > 0 ? streamedGames.length / totalGames.length : 0;

        const percentageAllStreamedGames = totalStreamedGamesCount > 0
            ? streamedGames.length / totalStreamedGamesCount
            : 0;

        return {
            package_id: pkg.id,
            name: pkg.name,
            weight,
            streamed_games: streamedGames,
            percentageAllStreamedGames,
            percentageAllGames
        };
    });

    // Sort the service ranking
    service.sort((a, b) => {
        if (b.percentageAllStreamedGames !== a.percentageAllStreamedGames) {
            return b.percentageAllStreamedGames - a.percentageAllStreamedGames; // Sort by percentage DESC
        }
        if (a.weight !== b.weight) {
            return a.weight - b.weight; // Sort by weight ASC
        }
        return a.name.localeCompare(b.name); // Sort by name ASC
    });

    console.timeEnd("singleRanking");

    return {
        service,
        totalGames: totalGames.map(g => g.id),
        streamedGames: allStreamedGames.map(g => g.id),
        allDisplayedGames: allDisplayedGames.map(g => g.id)
    };
}

// Example Request
const request = {
    teams: ["Deutschland", "Bayern München"],
    live: true,
    highlight: false,
    tournamentName: ["Europameisterschaft 2024"],
    timeFrom: "",
    timeUntil: "",
    abo: 2
};

// singleRanking(request).then(console.log);
