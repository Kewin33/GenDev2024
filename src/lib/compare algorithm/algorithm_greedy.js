/**
 * Greedy algorithm for the weighted set cover problem.
 *
 * @param {Array} U - Array of all elements to cover.
 * @param {Array} S - Array of objects {id, subset, weight}.
 * @returns {{rest: Array, finalCosts: number, pickedSets: Array}}
 */
export function greedySetCover(U, S) {
    console.time("greedySetCover");

    let finalCosts = 0;
    let coveredElements = [];
    let pickedSets = [];

    // Preprocess S to include cost per element
    S = S.map(e => ({
        ...e,
        costPerElement: e.weight / e.gameIds.length
    }));

    // Main algorithm loop
    while (!U.every(e => coveredElements.includes(e))) {
        if (S.length === 0) {
            let rest = U.filter(u => !coveredElements.includes(u));
            console.timeEnd("greedySetCover");
            return { pickedSets, finalCosts, rest };
        }

        // Pick the set with the lowest weight
        let lowest = S.reduce((min, obj) => obj.weight < min.weight ? obj : min);
        finalCosts += lowest.weight;
        S = S.filter(s => s.id !== lowest.id);
        pickedSets.push(lowest.id);

        // Update covered elements and remaining sets
        lowest.gameIds.forEach(e => coveredElements.push(e));
        S.forEach(item => {
            lowest.gameIds.forEach(e => {
                item.gameIds = item.gameIds.filter(s => s !== e);
            });
            if (item.gameIds.length === 0) {
                S = S.filter(s => s !== item);
            }
            item.costPerElement = item.weight / item.gameIds.length;
        });
    }

    console.timeEnd("greedySetCover");
    return { pickedSets, finalCosts };
}

// Example Usage
let U = Array.from({ length: 80 }, (_, i) => i + 1);
let S = U.map(s => ({
    id: s,
    gameIds: Array.from({ length: Math.floor(Math.random() * 38) }, () => Math.floor(Math.random() * 100)),
    weight: Math.floor(Math.random() * 40)
}));
//console.log(greedySetCover(U, S));
