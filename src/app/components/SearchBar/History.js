import React, {useEffect} from "react";

function History({handleSelectTeam, filterOptions, setFilterOptions, openHistory, closeHistoryOptions, history, setHistory}){
    useEffect(() => {
        const storedHistory = localStorage.getItem("history");
        setHistory(storedHistory ? JSON.parse(storedHistory) : []);
    }, [openHistory]);
    async function handleHistoryItemClick(filterOptionsItem){
        console.log("hallo")
        await handleSelectTeam("--Keine auswählen--")
        filterOptionsItem.teams.map(async t => {
            await handleSelectTeam(t)
        })
        setFilterOptions({...filterOptions,
            preferredStreamingPackages: filterOptionsItem.preferredStreamingPackages,
            tournamentName: filterOptionsItem.tournamentName,
            timeFrom: filterOptionsItem.timeFrom,
            timeUntil: filterOptionsItem.timeUntil,
            abo: filterOptionsItem.abo,
            highlight: filterOptionsItem.highlight,
            live: filterOptionsItem.live

        })
        closeHistoryOptions()
    }

    return (
        <>
            {<div className={`fixed overflow-auto inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ${openHistory? '' : "hidden"}`}>
                <div className="bg-white p-4 rounded-lg">
                    <h2 className="text-lg font-bold text-center border-b-3">Hier finden Sie Ihre letzten 5 Suchverläufe</h2>

                    {
                        history.length === 0 ?
                            "Du hast noch keine Suche abgefeuert!" :
                            <ul>
                                {[...history].reverse().map((filterOptionsItem, index) => (
                                    <li
                                        key={index}
                                        className="cursor-pointer text-black hover:bg-gray-300 text-center bg-gray-200 rounded p-4 m-4"
                                        onClick={() => handleHistoryItemClick(filterOptionsItem)}
                                    >
                                        <div>
                                            {filterOptionsItem.live && filterOptionsItem.highlight
                                                ? "Live und Highlight "
                                                : filterOptionsItem.live
                                                    ? "Live "
                                                    : filterOptionsItem.highlight
                                                        ? "Highlight "
                                                        : "Weder Live noch Highlight "}
                                            {" Spiele von " + filterOptionsItem.teams.join(", ")}
                                            <br/>
                                            {filterOptionsItem.timeFrom !== ""
                                                ? " von " + new Date(filterOptionsItem.timeFrom).toLocaleDateString("de-DE", { year: "numeric", month: "long", day: "numeric" })
                                                : ""}
                                            {filterOptionsItem.timeUntil !== ""
                                                ? " bis " + new Date(filterOptionsItem.timeUntil).toLocaleDateString("de-DE", { year: "numeric", month: "long", day: "numeric" })
                                                : ""}
                                            {filterOptionsItem.timeFrom !== "" || filterOptionsItem.timeUntil !== "" ? <br/>:""}
                                            {" mit " +
                                                filterOptionsItem.preferredStreamingPackages.length +
                                                " Anbietern und " +
                                                filterOptionsItem.tournamentName.length +
                                                " ausgewählten Ligen"}
                                        </div>
                                    </li>
                                ))}
                            </ul>


                    }

                    <div className="flex justify-start">
                        <button onClick={closeHistoryOptions} className="mt-4 p-2 bg-blue-500 rounded-lg shadow">
                            Schließen
                        </button>
                    </div>
                </div>
            </div>
            }
        </> )
}

export default History