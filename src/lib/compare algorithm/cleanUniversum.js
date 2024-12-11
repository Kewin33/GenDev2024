export default function cleanUniversum(gameIds, sets) {
    console.time('cleanUniversum');

    // Ein Set zum Speichern der gestreamten Spiele
    const streamedGames = new Set();

    // Alle Spiele aus den Sets in streamedGames hinzufügen
    sets.forEach(set => set.gameIds.forEach(gameId => streamedGames.add(gameId)));

    // Array für nicht gestreamte Spiele
    const notStreamedGames = [];

    // Filtert die Spiele aus gameIds, die in streamedGames sind
    const result = gameIds.filter(id => {
        if (streamedGames.has(id)) {
            return true; // Spiel ist gestreamt, also behalten
        }
        notStreamedGames.push(id); // Spiel ist nicht gestreamt, also hinzufügen
        return false; // Spiel nicht in result aufnehmen
    });

    // Protokollierung der Ergebnisse
    console.log('Gestreamte Spiele:', [...streamedGames]);
    console.log('Alle Spiele:', gameIds);
    console.log('Gestreamte Spiele (result):', result);
    console.timeEnd("cleanUniversum");

    // Gibt ein Array zurück: [gestreamte Spiele, nicht gestreamte Spiele]
    return [result, notStreamedGames];
}
