import {greedySetCover} from "../algorithm_greedy.js";
import {recursiveSetCover} from "./recursiveSetCover.js";
import cleanUniversum from "./cleanUniversum.js";

export function greedyThenRecursiveSetCover(gameIds,sets) {
    console.time("greedyThenRecursiveSetCover");
    let [pickedSets, weight] = greedySetCover(gameIds,sets);
    let idk = sets.filter(s=> pickedSets.includes(s.id))
    //console.log(gameIds);
    //console.log(idk.map(s => [s.gameIds,s.weight]));

    let result = recursiveSetCover(gameIds,idk);
    console.timeEnd("greedyThenRecursiveSetCover");
    return result
}