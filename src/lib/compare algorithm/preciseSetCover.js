import cleanUniversum from "./cleanUniversum.js";

export function preciseWeightedSetCover(gameIds, sets) {
    //const cache = cleanUniversum(gameIds, sets);
    //gameIds = cache[0];
    //const uncoveredGames = cache[1];
    console.time('weightedSetCover');
    const U = new Set(gameIds);  // Universe to cover

    let minWeight = Infinity;
    let bestSet = null;

    // Generate all possible subsets of the sets array (power set)
    const powerSet = (arr) => arr.reduce((subsets, value) => {
        return subsets.concat(subsets.map(set => [value, ...set]));
    }, [[]]);

    const allSubsets = powerSet(sets);

    // Check each subset to find the one that covers all elements in the universe U
    allSubsets.forEach(subset => {
        const covered = new Set();
        let totalWeight = 0;

        // Add all elements from this subset to the covered set
        subset.forEach(s => {
            s.gameIds.forEach(gid => covered.add(gid));
            totalWeight += s.weight;
        });

        // If this subset covers the universe, check its weight
        if (covered.size === U.size && totalWeight < minWeight) {
            minWeight = totalWeight;
            bestSet = subset;
        }
    });
    console.timeEnd('weightedSetCover');
    return {
        sets: bestSet,
        totalWeight: minWeight
    };
}