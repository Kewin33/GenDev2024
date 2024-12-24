import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

import fs from 'fs';
import path from 'path';
import {sort} from "next/dist/build/webpack/loaders/css-loader/src/utils.js";

const prisma = new PrismaClient();

export async function GET(req) {
    let { searchParams } = new URL(req.url)
    let usage = searchParams.get('usage');

    if(!usage){
        return NextResponse.json({message: "no usage provided!"}, {status: 400});
    }



    if (usage === "allGames"){
        const filePath = path.join(process.cwd(), 'src','app','api','getListOfAll', 'teams.json');
        if (fs.existsSync(filePath)) {

            const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            return NextResponse.json(data); // Returns the teams as JSON
        }

        console.log("requesting database!")
        const teams = await prisma.bc_game.findMany({
            select: {
                team_home: true,
                team_away: true,
            }
        });

        const uniqueTeams = new Set();
        teams.forEach(game => {
            uniqueTeams.add(game.team_home);
            uniqueTeams.add(game.team_away);
        });

        const teamArray = Array.from(uniqueTeams).sort();
        //console.log(teamArray);

        fs.writeFileSync(filePath, JSON.stringify(teamArray, null, 2));
        return NextResponse.json(teamArray); // Returns the teams as JSON
    }



    if (usage === "allStreamingServices"){
        const filePath = path.join(process.cwd(), 'src','app','api','getListOfAll', 'services.json');
        if (fs.existsSync(filePath)) {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            return NextResponse.json(data); // Returns the teams as JSON
        }

        let services = await prisma.bc_streaming_package.findMany({
            select: {
                name: true
            }
        });
        services = services.map(s=>s.name).sort()
        fs.writeFileSync(filePath, JSON.stringify(services, null, 2));

        return NextResponse.json(services); // Returns the teams as JSON
    }



    if (usage === "allTournaments"){
        const filePath = path.join(process.cwd(), 'src','app','api','getListOfAll', 'tournaments.json');
        if (fs.existsSync(filePath)) {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            return NextResponse.json(data); // Returns the teams as JSON
        }

        const tournaments = await prisma.bc_game.findMany({
            select: {
                tournament_name:true
            }
        });

        let uniqueTournaments = new Set();
        tournaments.forEach(t => {
            uniqueTournaments.add(t.tournament_name)
        });
        //console.log(uniqueTournaments);
        uniqueTournaments = Array.from(uniqueTournaments).sort()

        //console.log(uniqueTournaments);
        fs.writeFileSync(filePath, JSON.stringify(uniqueTournaments, null, 2));

        return NextResponse.json(uniqueTournaments); // Returns the teams as JSON
    }
}

//console.log(await getTeamsAndSaveToFile());

