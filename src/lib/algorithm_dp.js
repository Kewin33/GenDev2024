// ab |U|<4 zu lange
// + heuristik, dass wenn ein element einfach vorkommt dann mus der set genommen werden
function weightedSetCover(sets, weights, universe) {
    console.time("dp algorithmus")
    const n = universe.length;
    const dp = Array(1 << n).fill(Infinity); // Initialisiere dp-Tabelle mit Unendlich
    const chosenSets = Array(1 << n).fill(-1); // Verfolgung der gewählten Sets
    dp[0] = 0; // Basisfall: keine Elemente abgedeckt -> Kosten = 0

    // Hilfsfunktion, um die Menge als Bitmaske darzustellen
    function getMask(set) {
        let mask = 0;
        for (let elem of set) {
            mask |= (1 << universe.indexOf(elem));
        }
        return mask;
    }

    const masks = sets.map(getMask); // Bitmasken für alle Sets berechnen

    // Dynamisches Füllen der dp-Tabelle
    for (let mask = 0; mask < (1 << n); mask++) {
        for (let i = 0; i < sets.length; i++) {
            const newMask = mask | masks[i]; // Neues Set abdecken
            const newCost = dp[mask] + weights[i]; // Neue Kosten berechnen

            if (newCost < dp[newMask]) {
                dp[newMask] = newCost;
                chosenSets[newMask] = i;
            }
        }
    }

    // Der letzte Zustand deckt das gesamte Universum ab
    if (dp[(1 << n) - 1] === Infinity) {
        return { cost: -1, sets: [] }; // Keine Lösung gefunden
    }

    // Rückverfolgung der gewählten Sets
    let coveredMask = (1 << n) - 1;
    const resultSets = [];
    while (coveredMask > 0) {
        const chosenSet = chosenSets[coveredMask];
        resultSets.push(sets[chosenSet]);
        coveredMask ^= masks[chosenSet]; // Entferne die Elemente dieses Sets
    }
    console.timeEnd("dp algorithmus")
    return { cost: dp[(1 << n) - 1], sets: resultSets };
}

// Beispielaufruf

const sets = [
    ['a', 'b','c'],
    ['b'],
    ['a','d'],
    ['c','e','f'],
    ['g','h'],
];
const weights = [15, 5, 3, 4, 3];
const universe = ['a', 'b', 'c','d','e','f','g','h'];

/*
const sets = [
    [1,2,3,5],
    [2,5,3,4],
    [6]
]
const weights = [3,4,5]
const universe = [1,2,3,4]
 */

const result = weightedSetCover(sets, weights, universe);
console.log("Kosten:", result.cost);
console.log("Gewählte Sets:", result.sets);
