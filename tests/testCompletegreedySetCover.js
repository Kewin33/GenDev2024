import {
    getGamesByTeams,
    getStreamingPackagesByTeams
} from "../src/lib/database access/getStreamingPackagesByTeams.js";
import {greedySetCover} from "../src/lib/algorithm_greedy.js";
import {greedyThenRecursiveSetCover} from "../src/lib/compare algorithm/greedyThenRecursiveSetCover.js";
import cleanUniversum from "../src/lib/compare algorithm/cleanUniversum.js";
import {recursiveSetCover} from "../src/lib/compare algorithm/recursiveSetCover.js";

async function testCompleteSetCover(){
    let teams = ["Deutschland"]
    let gameIds = await getGamesByTeams(teams)
    let sets = await getStreamingPackagesByTeams(teams);
    let [newGameIds, notStreamedGames] = cleanUniversum(gameIds, sets);
    console.log(sets.length);
    console.log(gameIds.length);
    let result = greedyThenRecursiveSetCover(newGameIds, sets)
    console.log("Not streamed Games: " + notStreamedGames);
    console.log(result);
    return result
}

await testCompleteSetCover()