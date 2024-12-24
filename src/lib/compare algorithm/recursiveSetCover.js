/**
 *
 * @param gameIds
 * @param sets
 * @returns {[*,*]|[number,null]|[*,*]|[*,*]}
 */

export function recursiveSetCover(gameIds, sets) {
    console.time('recursiveSetCover');
    console.log("hello" + sets);
    /*
    let cache = []
    while (sets.length > 0) {
        for (let i = 1; i < sets.length; i++) {
            if (sets[i].gameIds.every(id => sets[0].gameIds.includes(id))) sets.splice(i, 1);
        }
        cache.push(sets.shift())
        //console.log(cache)
    }
    sets = cache

     */

    for (let i = 1; i < sets.length; i++) {
        if (sets[i].gameIds.every(id => sets[0].gameIds.includes(id))) sets.splice(i, 1);
    }
    console.log(sets.map(s=> s.id));
    let result = recSetCover([], sets, gameIds, []);
    console.timeEnd('recursiveSetCover');
    return result
}

function recSetCover(covered, sets, gameIds, pickedSet) {
    //console.log("rec call");
    //console.log(pickedSet);
    //console.log(sets);

    // Prüfe, ob alle Spiele abgedeckt sind
    if (gameIds.every(id => covered.includes(id))) {
        // Berechne die Summe der Gewichte der ausgewählten Sets
        const totalWeight = pickedSet.map(item => item.weight).reduce((sum, weight) => sum + weight, 0);
        return [totalWeight, pickedSet.map(s=>s.id)];
    }
    // Prüfe, ob alle Sets abgearbeitet sind
    if (sets.length === 0) return [Infinity, null];

    // Kopiere das 'covered'-Array, um Referenzen zu vermeiden
    let tempCovered = [...covered, ...sets[0].gameIds];

    // Kopiere das 'sets'-Array für beide Rekursionspfade
    let remainingSets = sets.slice(1);

    // Rekursiver Aufruf: Set auswählen
    let [weightIncluded, setsIncluded] = recSetCover(tempCovered, remainingSets, gameIds, [...pickedSet, sets[0]]);

    // Rekursiver Aufruf: Set nicht auswählen
    let [weightExcluded, setsExcluded] = recSetCover(covered, remainingSets, gameIds, pickedSet);

    // Vergleiche die Gewichte und gib das kleinere Ergebnis zurück
    if (weightIncluded < weightExcluded) {
        return [weightIncluded, setsIncluded];
    } else {
        return [weightExcluded, setsExcluded];
    }
}