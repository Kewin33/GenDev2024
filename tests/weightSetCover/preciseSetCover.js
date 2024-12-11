import {preciseWeightedSetCover} from "../../src/lib/compare algorithm/preciseSetCover.js";
import {recursiveSetCover} from "../../src/lib/compare algorithm/recursiveSetCover.js";
import {greedySetCover} from "../../src/lib/algorithm_greedy.js";
import {greedyThenRecursiveSetCover} from "../../src/lib/compare algorithm/greedyThenRecursiveSetCover.js";
// Example usage
const gameIds = Array.from({length: 100},(_,i) => i+1);


// Randomly generated sets
const randomSets = Array.from({length:26},(_,i)=>({
    id: i,
    gameIds: Array.from({length: 100}, () => Math.floor(Math.random()*100) + 1),
    weight: Math.floor(Math.random()*50)
}));
// Combine manual sets and random sets
const result = recursiveSetCover(gameIds, randomSets);
console.log(result);
const result1 = greedySetCover(gameIds, randomSets);
console.log(result1);
const result2 = greedyThenRecursiveSetCover(gameIds, randomSets);
console.log(result2);