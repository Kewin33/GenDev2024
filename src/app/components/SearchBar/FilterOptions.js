import React from "react";
import Dropdown from "./Dropdown.js";

function FilterOptions({showFilterOptions, closeFilterOptions, setFilterOptions, filterOptions}) {
    async function leagueData(data) {
        console.log(data);
        await setFilterOptions(prevState => ({
            ...prevState,
            tournamentName: data || [],
        }));
        console.log("changed league data", filterOptions);
    }

    async function streamingNameData(data) {
        await setFilterOptions((prevState) => ({
            ...prevState,
            preferredStreamingPackages: data || [],
        }));
        console.log("changed streamingName data", filterOptions);
    }

    function setTime(e) {
        const time = e.target.id;
        const value = e.target.value;

        setFilterOptions(prev => {
            const timeFrom = prev.timeFrom;
            const timeUntil = prev.timeUntil;

            if (time === "timeFrom" && timeUntil && timeUntil < value) {
                alert("You wanna travel through time?!");
                return prev;
            }

            if (time === "timeUntil" && timeFrom && timeFrom > value) {
                alert("You wanna travel through time?!");
                return prev;
            }

            return time === "timeFrom"
                ? {...prev, timeFrom: value}
                : {...prev, timeUntil: value};
        });
    }

    function setLive() {
        setFilterOptions(prev => ({...prev, live: !prev.live}));
    }

    function setHighlight() {
        setFilterOptions(prev => ({...prev, highlight: !prev.highlight}));
    }

    function setAbo(e) {
        const element = e.target.placeholder;
        setFilterOptions(prev => ({ ...prev, abo: element }));
    }

    return <>
        {<div className={`fixed overflow-auto inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ${showFilterOptions? '' : "hidden"}`}>
            <div className="bg-white p-4 rounded-lg">
                <h2 className="text-lg font-bold text-center border-b-3">Filter Optionen</h2>
                <p className="mb-2">Verfeinern Sie nach Ihrem Geschmack!</p>
                {/*
                                tournamentName: null,
                                timeFrom: null,
                                timeUntil: null,
                                preferredStreamingPackages: null,
                            */}
                <text className="italic underline font-bold"> Zeitraum der Spiele</text>
                <div className="flex flex-col justify-between">
                    Von:
                    <input id="timeFrom"
                           value={filterOptions.timeFrom}
                           type="date"
                           placeholder="Urknall"
                           onChange={setTime}
                           className="border rounded bg-gray-300 p-1 m-4"
                    />


                    Bis:
                    <input id="timeUntil"
                           type="date"
                           placeholder="Kalter Tod"
                           value={filterOptions.timeUntil}
                           onChange={setTime}
                           className="border rounded bg-gray-300 p-1 m-4"
                    />


                    <text className="italic underline font-bold"> Highlight vs Live - oder beides?</text>
                    <div className="flex justify-around">
                                    <span> Live       <input type="checkbox" className="pt-1 ml-2"
                                                             checked={filterOptions.live} onChange={setLive}/></span>
                        <span> Highlight <input type="checkbox" className="pt-1 ml-2"
                                                checked={filterOptions.highlight} onChange={setHighlight}/></span>

                    </div>

                    <text className="italic underline font-bold"> Welches Abo ist mehr smash?</text>
                    <div className="flex justify-around">
                        <span> Monatlich       <input type="checkbox" className="pt-1 ml-2" placeholder="0" checked={filterOptions.abo === "0"} onChange={setAbo}/></span>
                        <span> Jährlich <input type="checkbox" className="pt-1 ml-2" placeholder="1" checked={filterOptions.abo === "1"} onChange={setAbo} /></span>
                        <span> Egal <input type="checkbox" className="pt-1 ml-2" placeholder="2" checked={filterOptions.abo === "2"} onChange={setAbo}/></span>

                    </div>


                    <text className="italic underline font-bold"> Ligen</text>
                    <Dropdown usage="Eine Liga/Ligen" optionData={leagueData} oldData={filterOptions}/>

                    <text className="italic underline font-bold"> Bevorzugte Streaming Anbieter?</text>
                    <Dropdown usage=" Einen Streaming Anbieter/Streaming Anbieter"
                              optionData={streamingNameData} oldData={filterOptions}/>
                </div>

                <div className="flex justify-start">
                    <button onClick={closeFilterOptions} className="mt-4 p-2 bg-blue-500 rounded-lg shadow">
                        Anwenden
                    </button>
                </div>
            </div>
        </div>
        }
    </>
}

export default FilterOptions