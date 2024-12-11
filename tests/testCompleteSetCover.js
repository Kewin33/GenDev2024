import {
    getGamesByTeams,
    getStreamingPackagesByTeams
} from "../src/lib/database access/getStreamingPackagesByTeams.js";
import {dpWeightedSetCover} from "../src/lib/compare algorithm/dpSetCover.js";
import {preciseWeightedSetCover} from "../src/lib/compare algorithm/preciseSetCover.js";

async function testCompleteSetCover(){
    let teams = ["Deutschland"]
    let allGames = await getGamesByTeams(teams)
    let idk = await getStreamingPackagesByTeams(teams);
    console.log(dpWeightedSetCover(allGames, idk))
}

await testCompleteSetCover()


function idk(){
    let streamingPackage =  [{
            id: 2,
            weight: 6000,
            gameIds: [
                1,  2, 14, 15, 25,
                37, 38, 45, 47
            ]
        },
        {
            id: 3,
            weight: 2,
            gameIds: [
                1,  2, 14, 15, 25,
                37, 38, 45, 47
            ]
        },
        {
            id: 4,
            weight: 1,
            gameIds: [
                1,  2, 14, 15, 25,
                37, 38, 45, 47, 48
            ]
        },
    ]

    let allGames = [1,15,48]

    console.log(dpWeightedSetCover(allGames, idk));
}