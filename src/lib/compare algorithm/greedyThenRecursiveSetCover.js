import { greedySetCover } from "./algorithm_greedy.js";
import { recursiveSetCover } from "./recursiveSetCover.js";

/**
 * Führt zuerst den Greedy-Set-Cover-Algorithmus aus und dann den rekursiven Algorithmus,
 * um die bestmögliche Kombination von Sets zu finden.
 *
 * @param gameIds - Die IDs der Spiele, die abgedeckt werden sollen
 * @param sets - Die verfügbaren Sets, die Spiele abdecken können
 * @returns {{pickedSets: *, weight: *, rest: *}} - Das Ergebnis mit den ausgewählten Sets, dem Gewicht und den restlichen Spielen
 */
export function greedyThenRecursiveSetCover(gameIds, sets) {
    console.time("greedyThenRecursiveSetCover");

    // 1. Greedy-Algorithmus durchführen
    let greedy = greedySetCover(gameIds, sets);  // [pickedSets, weight]
    console.log("Result greedy: ", greedy.pickedSets);

    // 2. Falls ein Rest vorhanden ist, aktualisieren wir die Spiel-IDs
    if ('rest' in greedy) {
        console.log("rest detected");
        // Spiele, die nicht abgedeckt wurden, aus den gameIds entfernen
        gameIds = gameIds.filter(gid => !greedy.rest.includes(gid));
        // Rückgabe der restlichen Spiele für spätere Berechnungen
    } else {
        greedy.rest = [];  // Keine Rest-Spiele, falls nicht vorhanden
    }

    // 3. Rekursiver Set-Cover-Algorithmus mit den übrig gebliebenen Spielen und Sets
    let result = recursiveSetCover(gameIds, sets.filter(s => greedy.pickedSets.includes(s.id)));

    if (result[1] === null) {
        console.log("recursiveSetCover failed");
        console.timeEnd("greedyThenRecursiveSetCover");
        return { weight: greedy.weight, pickedSets: greedy.pickedSets, rest: greedy.rest };
    }

    console.log("Result rec: ", result[1]);
    console.timeEnd("greedyThenRecursiveSetCover");

    // 4. Rückgabe der Ergebnisse, einschließlich der gewählten Sets und des Restes
    return {
        weight: result[0],  // Gewicht aus der rekursiven Berechnung
        pickedSets: result[1],  // Die Sets, die von der rekursiven Berechnung ausgewählt wurden
        rest: greedy.rest  // Die nicht abgedeckten Spiele (Rest)
    };
}
