import {greedySetCover} from "../algorithm_greedy.js";
import {recursiveSetCover} from "./recursiveSetCover.js";
import cleanUniversum from "./cleanUniversum.js";

/**
 *
 * @param gameIds
 * @param sets
 * @returns {{pickedSets: *, weight: *}}
 */
export function greedyThenRecursiveSetCover(gameIds,sets) {
    console.time("greedyThenRecursiveSetCover");
    //console.log(gameIds);
    //console.log(sets);
    let greedy = greedySetCover(gameIds,sets);  //[pickedSets, weight]
    console.log("Result greedy " + greedy.pickedSets);
    let idk = sets.filter(s=> greedy.pickedSets.includes(s.id))
    //console.log(idk.map(s => [s.gameIds,s.weight]));
    //console.log(greedy);
    if ('rest' in greedy){
        console.log("rest detected");
        //console.log("gameIds" + gameIds);
        gameIds = gameIds.filter(gid=> !greedy.rest.includes(gid))
        //console.log("gameIds" + gameIds);
    }
    let result = recursiveSetCover(gameIds,idk);
    if (result[1] === null) {
        console.log("recursiveSetCover failed");
        return {weight: greedy.weight, pickedSets: greedy.pickedSets}
    }
    console.log("Result rec " + result[1]);
    console.timeEnd("greedyThenRecursiveSetCover");
    return {weight:result[0], pickedSets: result[1]}
}