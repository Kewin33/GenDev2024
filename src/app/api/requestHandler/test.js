import {
    getGamesByTeams,
    getStreamingPackagesByTeams
} from "../../../lib/database access/getStreamingPackagesByTeams.js";
import cleanUniversum from "../../../lib/compare algorithm/cleanUniversum.js";
import {greedyThenRecursiveSetCover} from "../../../lib/compare algorithm/greedyThenRecursiveSetCover.js";
import {availabilityDataForTable} from "../../../lib/database access/availabilityDataForTable.js";
import {NextResponse} from "next/server.js";

export async function POST(req) {
    let  request = await req.json();
    let submittedTeams = request.teams
    let filterOptions = request.filterOptions
    //console.log(submittedTeams);
    console.log(filterOptions);

    let gameIds = await getGamesByTeams(submittedTeams, filterOptions.timeFrom || null , filterOptions.timeUntil||null, filterOptions.preferredStreamingPackages.length ? filterOptions.preferredStreamingPackages : null, filterOptions.tournamentName.length ? filterOptions.tournamentName : null)
    let sets = await getStreamingPackagesByTeams(gameIds, filterOptions.preferredStreamingPackages.length ? filterOptions.preferredStreamingPackages : null, filterOptions.live, filterOptions.highlight, filterOptions.abo);
    let [newGameIds, notStreamedGames] = cleanUniversum(gameIds, sets);

    let bestStreamingPackageKombi = greedyThenRecursiveSetCover(newGameIds, sets)   //change here for different algorithms

    let dataToDisplay = await availabilityDataForTable(gameIds,bestStreamingPackageKombi[1])
    console.log(dataToDisplay);
    return NextResponse.json({ message: 'Daten erfolgreich empfangen', data: {dataToDisplay} }, { status: 200 });
}