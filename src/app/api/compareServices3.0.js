//concatenate dbs and then make one call
//I need array of streaming package, that gives an array of games /all games

import {
    getAllStreamingIds,
    getGamesByTeamAndStreamingPackage,
    getGamesByTeamName
} from "../../lib/compareServicesHelper.js";

let team = 'Deutschland' //@param

console.time("idk")
let allStreamingPackages = await getAllStreamingIds()
let streamingPackageWithStreamedGames  = await Promise.all(
    allStreamingPackages.map(async id => ({
        streamingId : id.id,
        gameIds : (await getGamesByTeamAndStreamingPackage(team, id.id)).map(games => games.id),
       //costs:
    }))
)

let allGamesByTeam = await getGamesByTeamName(team)

console.table(streamingPackageWithStreamedGames)
console.log("Alle Spiele: " + allGamesByTeam)

console.timeEnd("idk")