import { NextResponse } from 'next/server';

import {greedyThenRecursiveSetCover} from "../../../lib/compare algorithm/greedyThenRecursiveSetCover.js";
import {
    getGamesByTeams,
    getStreamingPackagesByTeams
} from "../../../lib/database access/getStreamingPackagesByTeams.js";
import cleanUniversum from "../../../lib/compare algorithm/cleanUniversum.js";
import {availabilityDataForTable} from "../../../lib/database access/availabilityDataForTable.js";
import {recursiveSetCover} from "../../../lib/compare algorithm/recursiveSetCover.js";
import {greedySetCover} from "../../../lib/algorithm_greedy.js";
import {singleRanking} from "../../../lib/database access/singleRanking.js";


export async function POST(req) {

    console.log("teams submittion landed on server");
    let  request = await req.json();
    let submittedTeams = request.teams
    let filterOptions = request.filterOptions
    //console.log(submittedTeams);
    //console.log(filterOptions);
    /** alternative old version
    let gameIds = await getGamesByTeams(submittedTeams, filterOptions.timeFrom || null , filterOptions.timeUntil||null, filterOptions.preferredStreamingPackages.length ? filterOptions.preferredStreamingPackages : null, filterOptions.tournamentName.length ? filterOptions.tournamentName : null)
    let sets = await getStreamingPackagesByTeams(gameIds, filterOptions.preferredStreamingPackages.length ? filterOptions.preferredStreamingPackages : null, filterOptions.live, filterOptions.highlight, filterOptions.abo);
    let [newGameIds, notStreamedGames] = cleanUniversum(gameIds, sets);
     */

    console.log({...filterOptions, teams: submittedTeams})
    let databaseResponse = await singleRanking({...filterOptions, teams: submittedTeams})
    console.log("database request successful");
    //console.log(databaseResponse);
    let notStreamedGames = databaseResponse.totalGames.filter(gid => !databaseResponse.streamedGames.includes(gid))
    let dataToDisplay
    console.log(databaseResponse.allDisplayedGames);
    if (databaseResponse.service[0].percentageAllStreamedGames === 0) return NextResponse.json({ message: 'Daten erfolgreich empfangen', data: {} }, { status: 200 });
    if (databaseResponse.service[0].percentageAllStreamedGames === 1){
        console.log("only one package needed");
        dataToDisplay = await availabilityDataForTable(databaseResponse.allDisplayedGames, databaseResponse.service.map(s=>s.package_id).slice(0,5), notStreamedGames)
        //console.log(dataToDisplay);
    }else{
        let bestStreamingPackageCombi = greedyThenRecursiveSetCover(databaseResponse.streamedGames, databaseResponse.service.map(s => ({id: s.package_id,gameIds: s.streamed_games, weight: s.weight}) ))   //change here for different algorithms
        console.log("debug");
        console.log(bestStreamingPackageCombi.pickedSets);
        dataToDisplay = await availabilityDataForTable(databaseResponse.allDisplayedGames, bestStreamingPackageCombi.pickedSets, notStreamedGames)
        console.log("success");
    }
    //console.log(dataToDisplay);
    return NextResponse.json({ message: 'Daten erfolgreich empfangen', data: {dataToDisplay} }, { status: 200 });
}