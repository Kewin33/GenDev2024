import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

/**
 * Utility function to read or fetch data from the database and cache it to file.
 * @param {string} filePath - Path to the cache file.
 * @param {Function} fetchDataFn - Function to fetch data from the database.
 * @returns {Promise<Object>} - Cached or fetched data.
 */
async function getDataWithCache(filePath, fetchDataFn) {
    // If the cache file exists, return cached data
    if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        return data;
    }

    // Otherwise, fetch from the database and cache the result
    console.log("Fetching data from database...");
    const data = await fetchDataFn();

    // Write to cache file for future use
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return data;
}

export async function GET(req) {
    let { searchParams } = new URL(req.url);
    let usage = searchParams.get('usage');

    if (!usage) {
        return NextResponse.json({ message: "No usage provided!" }, { status: 400 });
    }

    if (usage === "allGames") {
        const filePath = path.join(process.cwd(), 'src', 'app', 'api', 'getListOfAll', 'teams.json');
        const teams = await getDataWithCache(filePath, async () => {
            const games = await prisma.bc_game.findMany({
                select: {
                    team_home: true,
                    team_away: true,
                }
            });

            const uniqueTeams = new Set();
            games.forEach(game => {
                uniqueTeams.add(game.team_home);
                uniqueTeams.add(game.team_away);
            });

            return Array.from(uniqueTeams).sort();
        });

        return NextResponse.json(teams);
    }

    if (usage === "allStreamingServices") {
        const filePath = path.join(process.cwd(), 'src', 'app', 'api', 'getListOfAll', 'services.json');
        const services = await getDataWithCache(filePath, async () => {
            let services = await prisma.bc_streaming_package.findMany({
                select: {
                    name: true
                }
            });
            return services.map(s => s.name).sort();
        });

        return NextResponse.json(services);
    }

    if (usage === "allTournaments") {
        const filePath = path.join(process.cwd(), 'src', 'app', 'api', 'getListOfAll', 'tournaments.json');
        const tournaments = await getDataWithCache(filePath, async () => {
            const tournaments = await prisma.bc_game.findMany({
                select: {
                    tournament_name: true
                },
                distinct: ['tournament_name'] // Using distinct to only fetch unique tournaments
            });

            return tournaments.map(t => t.tournament_name).sort();
        });

        return NextResponse.json(tournaments);
    }

    // Default response for unknown usage
    return NextResponse.json({ message: "Invalid usage provided!" }, { status: 400 });
}
