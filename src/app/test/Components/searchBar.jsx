'use client';
import React, {useEffect, useState} from "react";
import DatePicker from 'react-date-picker'



const SearchBar = ({ sendDataUp }) => {

    useEffect( () => {
        // Fetching data from the API route
        const fetchTeams = async () => {
            const response = await fetch('/api/getListOfAll?usage=allGames',{method: 'GET'});
            const data = await response.json();
            setTeams(data);
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
        setSelectedTeams([...selectedTeams,team]);
        setFilteredTeams([]);
    };

    const removeTeam = (indexToRemove,e) => {
        const newTeams = selectedTeams.filter((_, index) => index !== indexToRemove);
        setSelectedTeams(newTeams);
        //console.log(newTeams);
    }

    async function submitTeams (submittedTeams){
        //console.log(submittedTeams);
        const data = { teams: submittedTeams, filterOptions: filterOptions };
        console.log(data);
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
        console.log(result.data.dataToDisplay);

    }

    //showing filter options
    const [showFilterOptions, setShowFilterOptions] = useState(false);
    const [filterOptions,setFilterOptions] = useState(({
        tournamentName: [],
        timeFrom: "",
        timeUntil: "",
        preferredStreamingPackages: [],
    }));
    const openFilterOptions = () => {
        setShowFilterOptions(true);
    };
    const closeFilterOptions = () => {
        setShowFilterOptions(false);
    };

    function leagueData(data){
        //console.log("idk");
        //console.log(data);
        if (data === null || data.length === 0) {
            setFilterOptions({
                ...filterOptions,
                tournamentName: null,
            })
        } else {
            setFilterOptions({
                ...filterOptions,
                tournamentName: data,
            })
        }
        //console.log("changed league data" )
        //console.log(filterOptions);
    }

    function streamingNameData(data) {
        if (data === null || data.length === 0) {
            setFilterOptions({
                ...filterOptions,
                preferredStreamingPackages: null,
            })
        } else {
            setFilterOptions({
                ...filterOptions,
                preferredStreamingPackages: data,
            })
        }
        console.log("changed streamingName data" )
        console.log(filterOptions);
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
                    <ul className="top-16 absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg">
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

                {/* Filter options*/}
                <div className="p-2 mt-3 ml-3 text-blue-600 underline cursor-pointer hover:text-blue-800" onClick={()=>openFilterOptions()}>Filtern</div>
                {<div className={`fixed overflow-auto inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ${showFilterOptions? '' : "hidden"}`}>
                        <div className="bg-white p-4 rounded-lg">
                            <h2 className="text-lg">Filter Options</h2>
                            <p className="mb-2">Hier sind Ihre Filteroptionen.</p>
                            {/*
                                tournamentName: null,
                                timeFrom: null,
                                timeUntil: null,
                                preferredStreamingPackages: null,
                            */}
                            <div className="flex flex-col justify-between">
                                Von <input id="timeFrom"
                                           value={filterOptions.timeFrom}
                                           type="date"
                                           placeholder="Urknall"
                                           onChange={setTime}
                                           className="border rounded bg-gray-300 p-1 m-4"
                                />


                                Bis <input id="timeUntil"
                                           type="date"
                                           placeholder="Kalter Tod"
                                           value={filterOptions.timeUntil}
                                           onChange={setTime}
                                           className="border rounded bg-gray-300 p-1 m-4"
                                />
                                <Dropdown usage="Eine Liga/Ligen" optionData={leagueData} oldData={filterOptions}/>
                                <Dropdown usage=" Einen Streaming Anbieter/Streaming Anbieter" optionData={streamingNameData} oldData={filterOptions}/>
                            </div>

                            <div className="flex justify-evenly">
                                <button onClick={closeFilterOptions} className="mt-4 p-2 bg-red-500 rounded-lg shadow">
                                    Schließen
                                </button>
                                <button className="mt-4 p-2 bg-blue-500 rounded-lg shadow">
                                    Anwenden
                                </button>
                            </div>
                        </div>
                    </div>
                }
            </div>

            <div className="flex justify-end p-4 mb-10">

                <button
                    className={`p-2 rounded-lg mr-16 h-12 w-36 ${selectedTeams.length !== 0 ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300'}`}
                onClick={() => {
                    selectedTeams.length !== 0
                        ? submitTeams(selectedTeams)
                        : alert("Please have a favorite team!😟");
                }}
            >
                Go Ball!
            </button>
            </div>
        </div>

    );
};











import {useRef} from 'react';

function Dropdown({usage, optionData, oldData }){

    const [isOpen, setIsOpen] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const dropdownRef = useRef(null);

    let u
    useEffect(() => {
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
        let temp = selectedItems.includes(item) ? selectedItems.filter((i) => i !== item) : [...selectedItems, item]
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
            console.log("darn");
            const response = await fetch('/api/getListOfAll?usage='+u,{method: 'GET'});
            const data = await response.json();
            setItems(data);
            setSelectedItems(data)
            optionData(data)
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
                    {selectedItems.length > 0 ? selectedItems.length === 1?`${usage.split('/')[0]} gewählt` : selectedItems.length + " " + usage.split('/')[1] + ' Ligen gewählt' : 'Wähle ' + usage.split('/')[1]}
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
                                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
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
