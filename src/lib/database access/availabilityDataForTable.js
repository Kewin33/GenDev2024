import { PrismaClient } from "@prisma/client";

/**
 * Retrieves and organizes availability data for games and streaming packages.
 *
 * @param {Array<number>} gameIds - List of game IDs to query.
 * @param {Array<number>} streamingPackageIds - List of streaming package IDs to include.
 * @param {Array<number>} notStreamedGames - Games unavailable for streaming.
 * @returns {Object} - Structured data including competitions and streaming package names.
 */
export async function availabilityDataForTable(gameIds, streamingPackageIds, notStreamedGames) {
    const prisma = new PrismaClient();

    try {
        console.time("availabilityDataForTable");

        // Fetch streaming package details
        const streamingPackages = await prisma.bc_streaming_package.findMany({
            where: { id: { in: streamingPackageIds } },
            select: { id: true, name: true },
        });

        // Create a mapping of streaming package IDs to names
        const streamingPackageNames = streamingPackageIds.map(id => {
            const pkg = streamingPackages.find(pkg => pkg.id === id);
            return pkg ? pkg.name : "Unknown Package";
        });

        // Fetch game and offer details
        const games = await prisma.bc_game.findMany({
            where: { id: { in: gameIds } },
            select: {
                id: true,
                team_home: true,
                team_away: true,
                starts_at: true,
                tournament_name: true,
                bc_streaming_offer: {
                    where: { streaming_package_id: { in: streamingPackageIds } },
                    select: { live: true, highlights: true, streaming_package_id: true },
                },
            },
            orderBy: { tournament_name: "asc" },
        });

        // Group games by tournament name
        const competitionsData = games.reduce((acc, game) => {
            // Generate live/highlights availability array for each package
            const liveHighlightsArray = streamingPackageIds.map(id => {
                const offer = game.bc_streaming_offer.find(offer => offer.streaming_package_id === id);
                return notStreamedGames.includes(game.id)
                    ? { live: -1, highlights: -1 } // Indicates unavailable game
                    : { live: offer?.live ?? null, highlights: offer?.highlights ?? null };
            });

            // Create the game's subCompetition structure
            const subCompetition = {
                id: game.id,
                team_home: game.team_home,
                team_away: game.team_away,
                starts_at: game.starts_at,
                liveHighlights: liveHighlightsArray,
            };

            // Find or create the tournament group
            let tournament = acc.find(t => t.tournament_name === game.tournament_name);
            if (!tournament) {
                tournament = { tournament_name: game.tournament_name, subCompetitions: [] };
                acc.push(tournament);
            }

            // Add the game's details, sorted by start time
            tournament.subCompetitions.push(subCompetition);
            tournament.subCompetitions.sort((a, b) => new Date(a.starts_at) - new Date(b.starts_at));

            return acc;
        }, []);

        console.timeEnd("availabilityDataForTable");

        // Return the structured result
        return {
            competitionsData,
            streamingPackageNames,
        };
    } catch (error) {
        console.error("Error in availabilityDataForTable:", error);
        throw new Error("Failed to fetch availability data.");
    } finally {
        await prisma.$disconnect();
    }
}
