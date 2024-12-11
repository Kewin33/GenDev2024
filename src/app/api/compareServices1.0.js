//Ansatz 1 zu jedem spiel werden die streaming packages geholt und man muss ein finde die in alle drin ist

import {getAllStreamingIds, getGamesByTeamName, getStreamingIdsByGameId} from '../../lib/compareServicesHelper.js'
// missing express and post params

let team = 'Deutschland' //@param

console.time("idk")

let games = await getGamesByTeamName(team)
if (games.length === 0) throw new Error('No games found for this team: '+ team)

let gameIds = games.map(game => game.id)
//console.log(gameIds);
let streamingIds = await Promise.all( gameIds
    .map(async gameId => await getStreamingIdsByGameId(gameId))
    .flat()
)
//console.log(streamingIds);
//häufigkeit von jeder streaming package zählen?
//convert to array von packages mit den spielen
let allStreamingIds = await getAllStreamingIds();
/*
let idk = allStreamingIds.map(id => {
    streamingIds.filter(async array => array.filter(a => a.streaming_package_id === id).length > 0)
})
 */
let idk = streamingIds.filter(async array => array.filter(a => a.streaming_package_id === 2).length > 0)
idk = idk.map(a => a.game_id)
console.log(idk);
console.timeEnd("idk")