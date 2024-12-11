import {getGamesByTeamName} from "../compareServicesHelper.js";
import {greedySetCover} from "../algorithm_greedy.js";
import {preciseWeightedSetCover} from "./preciseSetCover.js";

let threshold = 5

export async default function index(teams) {
    let streamingPackagesByTeams = await getStreamingPackagesByTeams(teams) //database returns {package_id, weight, gameIds} using only monthly as weight
    let allGamesByTeams = await getGamesByTeamName(teams) // database returns [gameids]
    let bestPackage = streamingPackagesByTeams.filter(s => s.gamesIds.each(id => allGamesByTeams.includes(id)))
    if(bestPackage.length !== 0){
        return bestPackage.reduce((min, obj) => obj.weight < min.weight ? obj : min)
    }
    if (allGamesByTeams.length < threshold) {
        let result = preciseWeightedSetCover(streamingPackagesByTeams, allGamesByTeams)
    } else {
        let result = greedySetCover(streamingPackagesByTeams, allGamesByTeams)
    }

}