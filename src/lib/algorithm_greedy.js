//https://www.youtube.com/watch?v=EedhcIQp92k
//Greedy for weighed set cover
// input:
// - array U of all elements
// - array S of Objects {id, subset,weight}
// Output:
// - cost
// - combination (-1 if not possible)
/**
 *
 * @param U
 * @param S
 * @returns {{rest: *, finalCosts: number, pickedSets: *[]}}
 */
export function greedySetCover(U, S) {
    console.time("greedySetCover with array")
    let finalCosts = 0
    // bring S to the form array of {id, subset,weight,WeightPerElement}
    S = S.map(e => ({
        ...e,
        //weight: e.weight === 0? 1:e.weight,
        costPerElement: e.weight / e.gameIds.length
    }))
    //actual algorithm
    let coveredElements = []//new Set()
    let pickedSets = [] //new Set()
    //console.log(U);
    while (!U.every(e => coveredElements.includes(e)) ) {
        if(S.length === 0) {  // no solution
            let rest = U.filter(u => !coveredElements.includes(u));
            console.log("no solution with rest: " + rest);
            return {pickedSets, finalCosts, rest}
        }
        let lowest = S.reduce((min, obj) => obj.weight < min.weight ? obj : min)  // lowest ist {id, gameIds, weight,costPerElement}
        finalCosts += lowest.weight;
        //console.log("lowest: "); console.log(lowest);
        S = S.filter(s => s.id !== lowest.id)
        pickedSets.push(lowest.id)
        //console.log("pickedSets : " + pickedSets);
        lowest.gameIds.forEach(e => coveredElements.push(e));
        S.forEach((item) => { // item ist {gameIds, weight, costPerElement}
            lowest.gameIds.forEach(e => item.gameIds = item.gameIds.filter(s => s !== e))
            if (item.gameIds.length === 0) {
                S = S.filter(s => s !== item)
            }
            item.costPerElement = item.weight / item.gameIds.length
        })
        //console.log("modified S: "); console.log(S);
        //console.log("coveredElements: " + coveredElements);
    }
    console.timeEnd("greedySetCover with array")
    return {pickedSets, finalCosts}
}

/*

let U = Array.from({length:80}, (_, i) => i + 1)
let S = U.map(s=> ({
    id: s,
    gameIds: Array.from({ length: Math.floor(Math.random() * 38) }, () => Math.floor(Math.random() * 100)),
    weight: Math.floor(Math.random() * 40)
}))
console.log(greedySetCover(U, S));

 */


//maybe set is faster
/*
//Greedy for weighed set cover
// input:
// - array U of all elements
// - array S of Objects {id, subset,weight}
// Output:
// - cost
// - combination (-1 if not possible)

export function greedySetCover(U,S){
    //Convert array to Sets
    U = new Set(U)
    S = new Set(S)
    // bring S to the form array of {id, subset,weight,WeightPerElement}
    S = S.map(e => ({
        ...e,
        costPerElement: e.weight/e.subset.length
    }))
    //actual algorithm
    let coveredElements = new Set()
    let pickedSets = new Set()
    while(![...U].every(e => coveredElements.has(e)) || S.empty()){
        let lowest = S.reduce((min, obj) => obj.weight < min.weight ? obj : min)  // lowest ist {id, subset, weight,costPerElement}
        S.delete(lowest)
        pickedSets.add(lowest.id)
        lowest.subset.forEach(e => coveredElements.add(e));
        S.forEach((item) => { // item ist {subset, weight, costPerElement}
            lowest.subset.forEach(e => item.subset.delete(e))
            if(item.subset.length === 0){
                S.delete(item)
            }
            item.costPerElement = item.weight / item.subset.length
        })
    }
    return pickedSets
}


let U = [1,2,3,4,5]
let S = [
    {id: U, subset: [1,2,4], weight: 3},
    {id: U, subset: [5], weight: 3},
    {id: U, subset: [2,3,4], weight: 3},
    {id: U, subset: [3], weight: 3},
]
console.log(greedySetCover(U, S));
 */