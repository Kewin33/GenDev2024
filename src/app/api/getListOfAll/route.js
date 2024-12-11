import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req) {
    let { searchParams } = new URL(req.url)
    let usage = searchParams.get('usage');

    if(!usage){
        return NextResponse.json({message: "no usage provided!"}, {status: 400});
    }
    if (usage === "allGames"){
        const teams = await prisma.bc_game.findMany({
            select: {
                team_home: true,
                team_away: true,
            }
        });

        // Entferne Duplikate, indem du die Teamnamen in ein Set speicherst
        const uniqueTeams = new Set();
        teams.forEach(game => {
            uniqueTeams.add(game.team_home);
            uniqueTeams.add(game.team_away);
        });

        // Wandle das Set in ein Array um
        const teamArray = Array.from(uniqueTeams);
        //console.log(teamArray);
        return NextResponse.json(teamArray); // Returns the teams as JSON
    }

    if (usage === "allStreamingServices"){
        let services = await prisma.bc_streaming_package.findMany({
            select: {
                name: true
            }
        });
        services = services.map(s=>s.name)
        return NextResponse.json(services); // Returns the teams as JSON
    }

    if (usage === "allTournaments"){
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
        uniqueTournaments = Array.from(uniqueTournaments)

        //console.log(uniqueTournaments);

        return NextResponse.json(uniqueTournaments); // Returns the teams as JSON
    }
}

//console.log(await getTeamsAndSaveToFile());

