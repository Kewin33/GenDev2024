import { NextResponse } from 'next/server';
import { greedyThenRecursiveSetCover } from "../../../lib/compare algorithm/greedyThenRecursiveSetCover.js";
import { availabilityDataForTable } from "../../../lib/database access/availabilityDataForTable.js";
import { singleRanking } from "../../../lib/database access/singleRanking.js";

export async function POST(req) {
    console.time("backend duration")
    console.log("teams submission landed on server");

    let request = await req.json();
    let submittedTeams = request.teams;
    let filterOptions = request.filterOptions;

    //console.log({...filterOptions, teams: submittedTeams});
    let databaseResponse = await singleRanking({...filterOptions, teams: submittedTeams});
    console.log("database request successful");

    let notStreamedGames = databaseResponse.totalGames.filter(gid => !databaseResponse.streamedGames.includes(gid));
    let dataToDisplay;

    console.log(databaseResponse.allDisplayedGames);

    // Case: No streamed games found (percentage is 0%)
    if (databaseResponse.service[0].percentageAllStreamedGames === 0) {
        console.timeEnd("backend duration")
        return NextResponse.json({ message: 'Daten erfolgreich empfangen', data: {} }, { status: 200 });
    }

    // Case: Only one package streams everything (percentage is 100%)
    if (databaseResponse.service[0].percentageAllStreamedGames === 1) {
        let bestStreamingPackageCombi = greedyThenRecursiveSetCover(databaseResponse.streamedGames, databaseResponse.service.map(s => ({
            id: s.package_id,
            gameIds: s.streamed_games,
            weight: s.weight
        })));

        let packageIdsWith100Percentage = databaseResponse.service
            .filter(s => s.percentageAllStreamedGames === 1)
            .map(s => s.package_id)
            .slice(0, 3);

        if (bestStreamingPackageCombi.weight < databaseResponse.service[0].weight) {
            let gameIdsToDisplay = [databaseResponse.service.shift().package_id, ...bestStreamingPackageCombi.pickedSets];
            gameIdsToDisplay = [...gameIdsToDisplay, ...databaseResponse.service.filter(s => s.percentageAllStreamedGames > 0)
                .map(s => s.package_id).filter(gid => !gameIdsToDisplay.includes(gid))
                .slice(0, Math.max(5 - gameIdsToDisplay.length))];

            console.log(gameIdsToDisplay);

            dataToDisplay = await availabilityDataForTable(databaseResponse.allDisplayedGames, gameIdsToDisplay, notStreamedGames);
            dataToDisplay = {
                ...dataToDisplay,
                packageCount: [
                    packageIdsWith100Percentage.length,
                    packageIdsWith100Percentage.length + bestStreamingPackageCombi.pickedSets.length
                ],
                restCount: bestStreamingPackageCombi.rest.length
            };
        } else {
            dataToDisplay = await availabilityDataForTable(databaseResponse.allDisplayedGames,
                databaseResponse.service.filter(s => s.percentageAllStreamedGames > 0)
                    .map(s => s.package_id).slice(0, 5), notStreamedGames);

            dataToDisplay = {
                ...dataToDisplay,
                packageCount: [
                    packageIdsWith100Percentage.length,
                    -1 // No additional packages required
                ],
                restCount: bestStreamingPackageCombi.rest.length
            };
        }

    } else {
        // Case: Multiple packages needed
        let bestStreamingPackageCombi = greedyThenRecursiveSetCover(databaseResponse.streamedGames, databaseResponse.service.map(s => ({
            id: s.package_id,
            gameIds: s.streamed_games,
            weight: s.weight
        })));

        //console.log("debug");
        //console.log(bestStreamingPackageCombi);

        let gameIdsToDisplay = [
            ...bestStreamingPackageCombi.pickedSets,
            ...databaseResponse.service.filter(s => s.percentageAllStreamedGames > 0)
                .map(s => s.package_id)
                .filter(gid => !bestStreamingPackageCombi.pickedSets.includes(gid))
                .slice(0, Math.max(0, 5 - bestStreamingPackageCombi.pickedSets.length))
        ];

        dataToDisplay = await availabilityDataForTable(databaseResponse.allDisplayedGames, gameIdsToDisplay, notStreamedGames);

        console.log("success");

        dataToDisplay = {
            ...dataToDisplay,
            packageCount: [-1, bestStreamingPackageCombi.pickedSets.length], // Multiple packages selected
            restCount: bestStreamingPackageCombi.rest.length
        };
    }
    console.timeEnd("backend duration")

    return NextResponse.json({ message: 'Daten erfolgreich empfangen', data: {dataToDisplay} }, { status: 200 });
}
