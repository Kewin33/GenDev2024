/**
 * Recursive algorithm for the weighted set cover problem.
 *
 * @param {Array} gameIds - Array of all game IDs to cover.
 * @param {Array} sets - Array of objects {id, gameIds, weight}.
 * @returns {[number, Array|null]} - Total weight and selected sets' IDs or null if not possible.
 */
export function recursiveSetCover(gameIds, sets) {
    console.time('recursiveSetCover');

    // Filter redundant sets (subset optimization)
    for (let i = 1; i < sets.length; i++) {
        if (sets[i].gameIds.every(id => sets[0].gameIds.includes(id))) {
            sets.splice(i, 1);
            i--; // Adjust index after removal
        }
    }

    const result = recSetCover([], sets, gameIds, []);
    console.timeEnd('recursiveSetCover');
    return result;
}

/**
 * Helper function for recursive weighted set cover.
 *
 * @param {Array} covered - Currently covered game IDs.
 * @param {Array} sets - Remaining sets to consider.
 * @param {Array} gameIds - All game IDs to cover.
 * @param {Array} pickedSet - Sets selected so far.
 * @returns {[number, Array|null]} - Total weight and selected sets' IDs.
 */
function recSetCover(covered, sets, gameIds, pickedSet) {
    // Base case: All game IDs are covered
    if (gameIds.every(id => covered.includes(id))) {
        const totalWeight = pickedSet.reduce((sum, set) => sum + set.weight, 0);
        return [totalWeight, pickedSet.map(s => s.id)];
    }

    // Base case: No sets left and not all IDs are covered
    if (sets.length === 0) return [Infinity, null];

    // Recursive case: Include the current set
    const updatedCovered = [...covered, ...sets[0].gameIds];
    const remainingSets = sets.slice(1);
    const [weightIncluded, setsIncluded] = recSetCover(updatedCovered, remainingSets, gameIds, [...pickedSet, sets[0]]);

    // Recursive case: Exclude the current set
    const [weightExcluded, setsExcluded] = recSetCover(covered, remainingSets, gameIds, pickedSet);

    // Return the option with the smaller weight
    return weightIncluded < weightExcluded ? [weightIncluded, setsIncluded] : [weightExcluded, setsExcluded];
}

// Example Usage
let gameIds = [1, 2, 3, 4, 5];
let sets = [
    { id: 'A', gameIds: [1, 2, 4], weight: 3 },
    { id: 'B', gameIds: [5], weight: 2 },
    { id: 'C', gameIds: [2, 3, 4], weight: 4 },
    { id: 'D', gameIds: [3], weight: 1 }
];
//console.log(recursiveSetCover(gameIds, sets));
