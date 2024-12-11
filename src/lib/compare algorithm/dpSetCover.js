import cleanUniversum from "./cleanUniversum.js";

export function dpWeightedSetCover(gameIds, sets) {
    const cache = cleanUniversum(gameIds, sets);
    gameIds = cache[0];
    const uncoveredGames = cache[1];
    console.log(sets.length);

    const U = gameIds.length;
    const n = 1 << U; // Total number of subsets of the universe (2^U)

    // DP array to store the minimum cost to cover each subset of the universe
    const dp = Array(n).fill(Infinity);
    const pickedSets = Array(n).fill(null); // Store picked sets for each subset
    dp[0] = 0; // Base case: No cost to cover the empty set

    // Helper function to compute the bitmask of a set of gameIds
    const getBitmask = (gameSet) => {
        let bitmask = 0;
        for (const game of gameSet) {
            const index = gameIds.indexOf(game);
            if (index !== -1) {
                bitmask |= (1 << index); // Set the bit corresponding to the game's index
            }
        }
        return bitmask;
    };

    // Iterate over each set
    for (const { id, gameIds: setGameIds, weight } of sets) {
        const bitmask = getBitmask(setGameIds);

        // Update the DP table for all existing subsets
        for (let subset = 0; subset < n; subset++) {
            const newSubset = subset | bitmask; // Union the current subset with the new set
            const newCost = dp[subset] + weight;

            if (newCost < dp[newSubset]) {
                dp[newSubset] = newCost; // Choose the minimum cost
                pickedSets[newSubset] = [...(pickedSets[subset] || []), id]; // Track the selected sets
            }
        }
        console.table(dp);
    }

    // If the last subset (representing the full universe) is still Infinity, it's not coverable
    if (dp[n - 1] === Infinity) {
        return {
            cost: -1, // No valid cover exists
            sets: [],
        };
    }

    return {
        cost: dp[n - 1], // Minimum cost to cover the universe
        sets: pickedSets[n - 1], // The picked sets that cover the universe
    };
}