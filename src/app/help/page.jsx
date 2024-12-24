'use client';
import React from 'react';
import Image from "next/image";

const HelpPage = () => {
    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-4">BallWatch – Alle Spiele, die besten Angebote</h1>
                <p className="text-lg text-gray-600">
                    Finde die besten Streaming-Pakete für deine Lieblingsteams! Wähle Teams aus, vergleiche Anbieter und
                    erhalte die günstigste Kombination, um alle Spiele zu sehen. Einfach, schnell, perfekt für dich.
                </p>
            </div>

            {/* Nutzung */}
            <div className="mb-12">
                <h2 className="text-2xl font-semibold mb-6">Benutzung</h2>
                <ul className="space-y-10">
                    {/* Schritt 1 */}
                    <li>
                        <h3 className="text-xl font-semibold mb-2">1. Teams wählen</h3>
                        <div className="flex flex-col md:flex-row gap-6 items-center">
                            <p className="text-gray-600">
                                Tippe dein Lieblingsteam in die Suchleiste ein und wähle aus den vorgegebenen Teams. Pro Tipp:
                                Gib nur einen Teil des Teamnamens ein, z. B. "Baye" für Bayern München. Deine gewählten Teams
                                siehst du oberhalb der Suchleiste und kannst sie dort auch entfernen.
                            </p>
                            <Image src="/images/teams.png" alt="Team auswählen" width={500} height={300} className="rounded-lg shadow-md" />
                        </div>
                    </li>

                    {/* Schritt 2 */}
                    <li>
                        <h3 className="text-xl font-semibold mb-2">2. Filteroptionen wählen</h3>
                        <div className="flex flex-col md:flex-row gap-6 items-center">
                            <p className="text-gray-600">
                                Möchtest du nur kommende Spiele sehen oder bestimmte Anbieter ausschließen? Klicke auf "Filtern"
                                unter der Suchleiste, um deine Suche anzupassen.
                            </p>
                            <Image src="/images/filter.png" alt="Filteroptionen" width={300} height={150} className="rounded-lg shadow-md" />
                        </div>
                    </li>

                    {/* Schritt 3 */}
                    <li>
                        <h3 className="text-xl font-semibold mb-2">3. Go Ball!</h3>
                        <div className="flex flex-col md:flex-row gap-6 items-center">
                            <p className="text-gray-600">
                                Klicke auf "Go Ball!", um deine Anfrage zu senden. Die Ergebnisse könnten ein paar Sekunden dauern,
                                da der Server kostenlos ist. Sieh dir die Ergebnisse an und finde die besten Streaming-Pakete für dich!
                            </p>
                            <Image src="/images/goball.png" alt="Go Ball!" width={500} height={300} className="rounded-lg shadow-md" />
                        </div>
                    </li>
                </ul>
            </div>

            {/* Ausgabe Erklärung */}
            <div className="mb-12">
                <h2 className="text-2xl font-semibold mb-6">Ausgabe Erklärung</h2>
                <ul className="space-y-6">
                    {/* Tabellenkopf */}
                    <li>
                        <h3 className="text-xl font-semibold">1. Tabellenkopf</h3>
                        <p className="text-gray-600">
                            Im Tabellenkopf siehst du die vorgeschlagenen Streaming-Anbieter. Die Farben in den Spalten zeigen,
                            ob ein Spiel live gestreamt wird, nur Highlights verfügbar sind oder gar nicht gestreamt wird.
                        </p>
                    </li>
                    {/* Tabellenspalte */}
                    <li>
                        <h3 className="text-xl font-semibold">2. Tabellenspalte</h3>
                        <p className="text-gray-600">
                            In der ersten Spalte sind die Turniere deiner Lieblingsteams aufgelistet. Mit einem Klick auf das
                            Dreieck kannst du die einzelnen Turniere einsehen.
                        </p>
                    </li>
                    {/* Farben */}
                    <li>
                        <h3 className="text-xl font-semibold">3. Farben</h3>
                        <p>
                            <span className="text-red-500 font-bold">Rot</span>: Wird nicht gestreamt<br/>
                            <span className="text-green-500 font-bold">Grün</span>: Wird gestreamt<br/>
                            <span className="text-gray-500 font-bold">Grau</span>: Unbekannt<br/>
                            <span className="text-yellow-500 font-bold">Gelb</span>: Teilweise gestreamt
                        </p>
                    </li>
                </ul>
            </div>

            {/* Fehlermeldungen */}
            <div className="mb-12">
                <h2 className="text-2xl font-semibold mb-6">Fehlermeldungen</h2>
                <ul className="space-y-4">
                    <li>
                        <h3 className="text-xl font-semibold">1. Sorry! No results found :(</h3>
                        <p className="text-gray-600">
                            Es wurden keine passenden Streaming-Anbieter gefunden. Passe deine Suchanfrage an.
                        </p>
                    </li>
                    <li>
                        <h3 className="text-xl font-semibold">2. You wanna travel through time?</h3>
                        <p className="text-gray-600">
                            Stelle sicher, dass der "von"-Zeitraum vor dem "bis"-Zeitraum liegt.
                        </p>
                    </li>
                    <li>
                        <h3 className="text-xl font-semibold">3. Liga wählen</h3>
                        <p className="text-gray-600">
                            Ein Fehler bei der Filterung: Wähle mindestens eine Liga aus, sonst macht das keinen Sinn.😒
                        </p>
                    </li>
                    <li>
                        <h3 className="text-xl font-semibold">4. Streaming-Package wählen</h3>
                        <p className="text-gray-600">
                            Ähnlich wie bei Punkt 3: Wähle mindestens einen Anbieter aus oder du bist ohne Sinn🐷
                        </p>
                    </li>
                    <li>
                        <h3 className="text-xl font-semibold">5. "Server Error"</h3>
                        <p className="text-gray-600">
                            Sollte ein Serverfehler auftreten, lade einfach die Seite neu.
                            Ich arbeite daran, die Stabilität zu verbessern. :)
                        </p>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default HelpPage;
