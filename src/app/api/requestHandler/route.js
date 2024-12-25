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
    //no games found that are streamed, highest percentage is 0%
    if (databaseResponse.service[0].percentageAllStreamedGames === 0) return NextResponse.json({ message: 'Daten erfolgreich empfangen', data: {} }, { status: 200 });
    //if one package streams everything
    if (databaseResponse.service[0].percentageAllStreamedGames === 1){
        //console.log("only one package needed");
        let bestStreamingPackageCombi = greedyThenRecursiveSetCover(databaseResponse.streamedGames, databaseResponse.service.map(s => ({id: s.package_id,gameIds: s.streamed_games, weight: s.weight}) ))   //change here for different algorithms
        let packageIdsWith100Percentage = (databaseResponse.service.filter(s=>s.percentageAllStreamedGames === 1).map(s=>s.package_id).slice(0,3))
        if (bestStreamingPackageCombi.weight < databaseResponse.service[0].weight){
            console.log("hier1");
            let gameIdsToDisplay = [databaseResponse.service.shift().package_id,...bestStreamingPackageCombi.pickedSets]
            gameIdsToDisplay = [...gameIdsToDisplay, ...databaseResponse.service.filter(s=>s.percentageAllStreamedGames > 0).map(s=>s.package_id).filter(gid => !gameIdsToDisplay.includes(gid)).slice(0,Math.max(5-gameIdsToDisplay.length))]
            console.log(gameIdsToDisplay);
            dataToDisplay = await availabilityDataForTable(databaseResponse.allDisplayedGames, gameIdsToDisplay, notStreamedGames)
            dataToDisplay = {...dataToDisplay, packageCount: [packageIdsWith100Percentage.length, packageIdsWith100Percentage.length + bestStreamingPackageCombi.pickedSets.length], restCount: bestStreamingPackageCombi.rest.length}
        }else {
            dataToDisplay = await availabilityDataForTable(databaseResponse.allDisplayedGames, databaseResponse.service.filter(s=>s.percentageAllStreamedGames > 0).map(s=>s.package_id).slice(0,5), notStreamedGames)
            dataToDisplay = {...dataToDisplay, packageCount: [packageIdsWith100Percentage.length, -1], restCount: bestStreamingPackageCombi.rest.length}
        }
        //console.log(dataToDisplay);

        //let dataToDisplay2 = await availabilityDataForTable(databaseResponse.allDisplayedGames, bestStreamingPackageCombi.pickedSets, notStreamedGames)
        //dataToDisplay = [...dataToDisplay,...dataToDisplay2]

    //computing the best combination
    }else{
        let bestStreamingPackageCombi = greedyThenRecursiveSetCover(databaseResponse.streamedGames, databaseResponse.service.map(s => ({id: s.package_id,gameIds: s.streamed_games, weight: s.weight}) ))   //change here for different algorithms
        console.log("debug");
        console.log(bestStreamingPackageCombi);
        dataToDisplay = await availabilityDataForTable(databaseResponse.allDisplayedGames, [...bestStreamingPackageCombi.pickedSets, ...databaseResponse.service.filter(s=>s.percentageAllStreamedGames > 0).map(s=>s.package_id).filter(gid => !bestStreamingPackageCombi.pickedSets.includes(gid)).slice(0, Math.max(0, 5-bestStreamingPackageCombi.pickedSets.length))], notStreamedGames)
        console.log("success");
        dataToDisplay = {...dataToDisplay, packageCount: [-1,bestStreamingPackageCombi.pickedSets.length], restCount: bestStreamingPackageCombi.rest.length}

        console.log("success");
    }
    //console.log(dataToDisplay);
    return NextResponse.json({ message: 'Daten erfolgreich empfangen', data: {dataToDisplay} }, { status: 200 });
}