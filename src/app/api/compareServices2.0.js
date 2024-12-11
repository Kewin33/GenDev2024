//Ansatz 2 zu jedem streaming package werden die Spiele geholt. man muss eine kombi finden die alle Spiele beinhaltet

import {
    getAllStreamingIds,
    getGameIdsByStreamingId, getGamesByIdAndTeam,
    getGamesByTeamName,
    getStreamingIdsByGameId
} from '../../lib/compareServicesHelper.js'
// missing express and post params

let team = 'Deutschland' //@param

console.time("idk")
let streamingPackages = await getAllStreamingIds()
//console.log(streamingPackages);
let streamingIds = streamingPackages.map(packages=>packages.id)
console.log(streamingIds);
let teamGames =await Promise.all(streamingIds.map(async streamingId=>{
    let allGames = await getGameIdsByStreamingId(streamingId)
    let allGamesIds = allGames.map(g=> g.id)
    return await Promise.all(allGamesIds.map(async id => await getGamesByIdAndTeam(id,team)))
}))
console.log(teamGames);
console.timeEnd("idk")


