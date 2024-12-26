import { PrismaClient } from "@prisma/client";

/**
 * @param request {*&{teams: (*|string[]|string[])}}
 * @returns {Promise<{totalGames: number[], service: {percentageAllStreamedGames: number, name: *, streamed_games: *, weight: number, package_id: *, percentageAllGames: number}[], streamedGames: number[], allDisplayedGames: number[]}>}
 */
export async function singleRanking(request) {
    console.time("singleRanking");

    //selsct all teams
    if (request.teams[0] === "Alle ausgewählt") request.teams = null

    const prisma = new PrismaClient();

    // Total games count involving the specified teams
    const totalGames = await prisma.bc_game.findMany({
        select: {
            id:true
        },
        where:
            request.teams !== null ?{
                OR: [
                    ...request.teams.map(team => ({ team_home: team })),
                    ...request.teams.map(team => ({ team_away: team }))
                ]
            }:{}
    });

    // Distinct streamed games for percentage_2 calculation
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
            ...(request.tournamentName.length > 0 && {tournament_name: { in: request.tournamentName }}),
            bc_streaming_offer: {
                some: {
                    ...(request.live && {live: 1 || undefined}),
                    ...(request.highlight && {highlights: 1 || undefined}),
                }
            }
        },
        select: { id: true }
    });

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
            ...(request.tournamentName.length > 0 && {tournament_name: { in: request.tournamentName }}),
        },
        select: { id: true }
    });

    const totalStreamedGamesCount = allStreamedGames.length;

    // Query packages with game details
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
                        ...(request.tournamentName.length > 0 && {tournament_name: { in: request.tournamentName }})
                    },
                    streaming_package:{
                        ...(request.preferredStreamingPackages.length > 0 && {name: { in: request.preferredStreamingPackages }})
                    },
                    ...(request.live && {live: 1 || undefined}),
                    ...(request.highlight && {highlights: 1 || undefined}),
                },
                select: {
                    game: {
                        select: { id: true }
                    }
                }
            }
        },
        orderBy: [
            { bc_streaming_offer: { _count: "desc" } },
            { monthly_price_cents: "asc" },
            { name: "asc" }
        ]
    });
    //console.log(result);
    // Format the response
    let service = result.map(pkg => {
        const streamedGames = pkg.bc_streaming_offer.map(offer => offer.game.id);

        const weight = [pkg.monthly_price_cents || pkg.monthly_price_yearly_subscription_in_cents, pkg.monthly_price_yearly_subscription_in_cents, Math.min(pkg.monthly_price_cents || pkg.monthly_price_yearly_subscription_in_cents, pkg.monthly_price_yearly_subscription_in_cents)][request.abo];

        const percentageAllGames = totalGames.length > 0 ? streamedGames.length / totalGames.length : 0;

        const percentageAllStreamedGames = totalStreamedGamesCount > 0
            ? streamedGames.length / totalStreamedGamesCount
            : 0;

        return  {
            package_id: pkg.id,
            name: pkg.name,
            weight,
            streamed_games: streamedGames,
            percentageAllStreamedGames,
            percentageAllGames
        };
    });
    service = service = service.sort((a, b) => {
        if (b.percentageAllStreamedGames !== a.percentageAllStreamedGames) {
            return b.percentageAllStreamedGames - a.percentageAllStreamedGames; // Sort by percentage DESC
        }

        if (a.weight !==  b.weight) {
            return a.weight - b.weight; // a is null, b is not null, so a comes after b
        }
        return a.name.localeCompare(b.name); // Sort by name ASC
    });

    //console.log(totalGames.map(g=> g.id));
    //console.log(service);
    console.timeEnd("singleRanking")
    return {service, totalGames: totalGames.map(g=> g.id), streamedGames : allStreamedGames.map(g=>g.id), allDisplayedGames : allDisplayedGames.map(g=>g.id)}
}

// Example Request
const request = {
    teams: ["Deutschland", "Bayern München"],
    live: true,
    highlight: false,
    tournamentName: ["Europameisterschaft 2024"],
    timeFrom: "",
    timeUntil: "",
    abo : 2
};

//await singleRanking(request);
