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


// Benannter Export für die POST-Methode
export async function POST(req) {
    let  request = await req.json();
    let submittedTeams = request.teams
    let filterOptions = request.filterOptions
    //console.log(submittedTeams);
    //console.log(filterOptions);

    let gameIds = await getGamesByTeams(submittedTeams, filterOptions.timeFrom || null , filterOptions.timeUntil||null, filterOptions.preferredStreamingPackages.length ? filterOptions.preferredStreamingPackages : null, filterOptions.tournamentName.length ? filterOptions.tournamentName : null)
    let sets = await getStreamingPackagesByTeams(gameIds, filterOptions.preferredStreamingPackages.length ? filterOptions.preferredStreamingPackages : null);
    let [newGameIds, notStreamedGames] = cleanUniversum(gameIds, sets);

    let bestStreamingPackageKombi = greedyThenRecursiveSetCover(newGameIds, sets)   //change here for different algorithms

    let dataToDisplay = await availabilityDataForTable(gameIds,bestStreamingPackageKombi[1])
    console.log(dataToDisplay);
    return NextResponse.json({ message: 'Daten erfolgreich empfangen', data: {dataToDisplay} }, { status: 200 });
}

// Optional: Du könntest auch andere HTTP-Methoden wie GET, PUT, DELETE exportieren
