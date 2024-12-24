'use client';
import React, {useEffect, useState} from "react";
import _ from 'lodash'



const SearchBar = ({ sendDataUp }) => {

    useEffect( () => {
        // Fetching data from the API route
        const fetchTeams = async () => {
            const response = await fetch('/api/getListOfAll?usage=allGames',{method: 'GET'});
            const data = await response.json();
            setTeams(['--Alle auswählen--','--Keine auswählen--', ...data]);
            console.log(data)
        };
        fetchTeams();
    }, []);

    const [teams, setTeams] = useState([]);
    const [selectedTeams, setSelectedTeams] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredTeams, setFilteredTeams] = useState([]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        if (e.target.value === "") {
            setFilteredTeams([]);
        } else {
            const filtered = teams.filter((team) =>
                team.toLowerCase().includes(e.target.value.toLowerCase()) && !(selectedTeams.includes(team)),
            );
            setFilteredTeams(filtered);
        }
    };

    const handleSelectTeam = (team) => {
        setSearchTerm("");

        setSelectedTeams((prevSelectedTeams) => {
            if (team === '--Alle auswählen--') {
                return ["Alle ausgewählt"];
            } else if (team === '--Keine auswählen--') {
                return [];
            } else if (!prevSelectedTeams.includes("Alle ausgewählt")) {
                return [...prevSelectedTeams, team];
            }
            return prevSelectedTeams;
        });

        setFilteredTeams([]);
    };

    const removeTeam = (indexToRemove,e) => {
        const newTeams = selectedTeams.filter((_, index) => index !== indexToRemove);
        setSelectedTeams(newTeams);
        //console.log(newTeams);
    }
    function equals(obj1, obj2) {
        return Object.keys(obj1).length === Object.keys(obj2).length &&
            Object.keys(obj1).every(key => obj1[key] === obj2[key]);
    }

    async function submitTeams (button, submittedTeams){
        //console.log(submittedTeams);
        setLoading(true)

        const data = { teams: submittedTeams, filterOptions: filterOptions };
        //console.log(data);

        //setting up search history
        const save = { teams: submittedTeams, ...filterOptions };
        let searchHistory = JSON.parse(localStorage.getItem('history')) || [];
        if (searchHistory.some(item => _.isEqual(item, save))) {
            searchHistory = searchHistory.filter(t => !_.isEqual(t, save)); // Entfernt das gleiche Objekt
        }
        searchHistory.push(save)
        if (searchHistory.length > 5) searchHistory.shift()
        localStorage.setItem('history', JSON.stringify(searchHistory));
        //end of setting search history

        const response = await fetch('/api/requestHandler', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        //console.log(result);
        sendDataUp(result.data.dataToDisplay)

        setLoading(false)

        //console.log(result.data.dataToDisplay);

    }

    //showing filter options
    const [showFilterOptions, setShowFilterOptions] = useState(false);
    const [filterOptions,setFilterOptions] = useState(({
        timeFrom: "",
        timeUntil: "",
        live: true,
        highlight: false,
        abo: "2",  // 0 monatlich, 1 jährlich, 2 egal
        preferredStreamingPackages: [],
        tournamentName: [],
    }));
    const openFilterOptions = () => {
        setShowFilterOptions(true);
    };
    const closeFilterOptions = () => {
        console.log(filterOptions);
        if (filterOptions.preferredStreamingPackages.length === 0) alert("Keine Streaming Services ausgewählt :(")
        else if (filterOptions.tournamentName.length === 0) alert("Keine Ligen ausgewählt :(")
        else setShowFilterOptions(false);
    };
    const [openHistory,setOpenHistory] = useState(false)
    function openHistoryOptions(){
        setOpenHistory(true);
    }
    function closeHistoryOptions(){
        setOpenHistory(false);
    }

    async function leagueData(data) {
        console.log(data);
        await setFilterOptions((prevState) => ({
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

        if (time === "timeFrom") {
            const timeUntil = filterOptions.timeUntil;

            if (timeUntil && timeUntil < value) {
                alert("You wanna travel through time?!");
                //setFilterOptions({ ...filterOptions, timeFrom: "" });
                return;
            }

            setFilterOptions({ ...filterOptions, timeFrom: value });
        }

        if (time === "timeUntil") {
            const timeFrom = filterOptions.timeFrom;

            if (timeFrom && timeFrom > value) {
                alert("You wanna travel through time?!");
                //setFilterOptions({ ...filterOptions, timeUntil: "" });
                return;
            }

            setFilterOptions({ ...filterOptions, timeUntil: value });
        }
    }

    function setLive() {
        setFilterOptions({ ...filterOptions, live: !filterOptions.live });
    }
    function setHighlight() {
        setFilterOptions({ ...filterOptions, highlight: !filterOptions.highlight });
    }
    function setAbo(e) {
        const element = e.target.placeholder
        setFilterOptions({ ...filterOptions, abo: element });
    }

    const [loading, setLoading] = useState(false);

    const [history, setHistory] = useState([]);
    useEffect(() => {
        const storedHistory = localStorage.getItem("history");
        setHistory(storedHistory ? JSON.parse(storedHistory) : []);
    }, [openHistory]);

    function handleHistoryItemClick(filterOptionsItem){
        console.log("hallo")
        handleSelectTeam("--Keine auswählen--")
        filterOptionsItem.teams.map(t=>{
            handleSelectTeam(t)
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
        <div className="z-0 overflow-hidden">
            <ul className="flex justify-items-start flex-wrap mt-10 mb-4  overflow-auto">
                {selectedTeams.map((team, index) => (
                    <li key={index} onClick={(e) => removeTeam(index, e)}>
                        <span className="flex p-2 bg-gray-300 rounded ml-4 cursor-pointer hover:bg-gray-500 m-2">
                            <i className="material-icons">close</i>
                            {team}
                        </span>

                    </li>
                ))}
            </ul>
            <div className="relative flex max-w-md mx-auto p-4 ">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Select favorite football teams..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />


                {filteredTeams.length > 0 && (
                    <ul className="top-16 absolute w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-48 shadow-lg overflow-visible z-50 ">
                        {filteredTeams.map((team, index) => (
                            <li
                                key={index}
                                onClick={() => handleSelectTeam(team)}
                                className="cursor-pointer p-3 hover:bg-blue-500 hover:text-white"
                            >
                                {team}
                            </li>
                        ))}
                    </ul>
                )}

                <div className="flex-col">
                    <div className="absolute top-16 right-8 p-2 ml-4 text-blue-600 underline cursor-pointer hover:text-blue-800" onClick={()=>openHistoryOptions()}>Verlauf</div>
                    <div className=" absolute top-16 left-4 p-2 ml-4 text-blue-600 underline cursor-pointer hover:text-blue-800" onClick={()=>openFilterOptions()}>Filtern</div>
                </div>

                {/* Filter options*/}
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
            </div>

            {/* Filter options*/}

            {/*History popup*/}
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
            {/*History popup*/}

            <div className="flex justify-end p-4 mb-10">

                <button
                    className={`p-2 rounded-lg mr-16 mt-8 h-12 w-36 ${selectedTeams.length !== 0 ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300'}`}
                    onClick={(e) => {
                        selectedTeams.length !== 0
                            ? submitTeams(e.target, selectedTeams)
                            : alert("Please have a favorite team!😟");
                    }}
                >
                    Go Ball!
                </button>
                {/* loading sign */}
                <div>
                    {
                        loading &&
                        <div className="fixed flex flex-col items-center justify-center float-left right-4 h-32">
                        <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                            <p className="text-blue-500 text-sm font-medium">Lemme think🤔</p>
                        </div>
                    }
                </div>


            </div>
        </div>

    );
};


import {useRef} from 'react';

function Dropdown({usage, optionData, oldData}) {

    const [isOpen, setIsOpen] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const dropdownRef = useRef(null);

    let u
    useEffect(() => {
        console.log("data from parent passed");
        if(usage.includes("Liga")){
            u = "allTournaments"
            if(oldData.tournamentName !== null) setSelectedItems(oldData.tournamentName)
        }
        if(usage.includes("Streaming")){
            u = "allStreamingServices"
            if (oldData.preferredStreamingPackages !== null ) setSelectedItems(oldData.preferredStreamingPackages)
        }
    }, []);




    const toggleDropdown = () => setIsOpen(!isOpen);

    async function handleItemClick(item){
        let temp
        console.log("current filter options" + selectedItems);
        console.log("changing filteroptions" + item);
        if (item.includes("Alle")) {
            temp = items.slice(2)
        }
        else if(item.includes("Keine")) temp = []
        else temp = selectedItems.includes(item) ? selectedItems.filter((i) => i !== item) : [...selectedItems, item]
        await setSelectedItems(temp);
        optionData(temp)

    }

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    const [items,setItems] = useState([])

    useEffect( () => {
        // Fetching data from the API route
        const fetchListData = async () => {
            const response = await fetch('/api/getListOfAll?usage='+u,{method: 'GET'});
            const data = await response.json();
            console.log("darn" + data);
            await setItems(["--Alle "+usage.split('/')[1]+" auswählen--", "--Keine "+usage.split('/')[1]+" auswählen--", ... data])
            //await handleItemClick("Alle")
            optionData(data)
            setSelectedItems(data)
        };
        fetchListData();
    }, []);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative inline-block text-left m-4" ref={dropdownRef}>
            <div>
                <button
                    onClick={toggleDropdown}
                    className="inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    {selectedItems.length > 0 ? selectedItems.length === 1?`${usage.split('/')[0]} gewählt` : selectedItems.length + " " + usage.split('/')[1] + ' gewählt' : 'Wähle ' + usage.split('/')[1]}
                    <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>

            {isOpen && (
                <div className="absolute z-10 mt-2 w-full rounded-md bg-white shadow-lg">
                    <div className="max-h-60 rounded-md py-1 overflow-x-scroll">
                        {items.map((item) => (
                            <div
                                key={item}
                                onClick={() => handleItemClick(item)}
                                className={`cursor-pointer select-none relative py-2 pl-3 pr-9 overflow-x-visible w-64 ${
                                    selectedItems.includes(item) ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                                }`}
                            >
                                <span className={`block truncate ${selectedItems.includes(item) ? 'font-medium' : 'font-normal'}`}>
                                    {item}
                                </span>
                                {selectedItems.includes(item) && (
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                        <svg className="h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M9 12l2 2l4 -4M21 12H3" />
                                        </svg>
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};



export default SearchBar;
