'use client';
import React, { useEffect, useState } from "react";
import FilterOptions from './FilterOptions';  // Importiere FilterOption-Komponente
import Dropdown from './Dropdown';            // Importiere Dropdown-Komponente

const SearchBar_backup = ({ sendDataUp }) => {
    const [teams, setTeams] = useState([]);
    const [selectedTeams, setSelectedTeams] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredTeams, setFilteredTeams] = useState([]);
    const [showFilterOptions, setShowFilterOptions] = useState(false);
    const [filterOptions, setFilterOptions] = useState({
        timeFrom: "",
        timeUntil: "",
        preferredStreamingPackages: [],
        tournamentName: [],
    });

    useEffect(() => {
        // Fetching teams from the API
        const fetchTeams = async () => {
            const response = await fetch('/api/getListOfAll?usage=allGames', { method: 'GET' });
            const data = await response.json();
            setTeams(data);
            console.log(data);
        };
        fetchTeams();
    }, []);

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
        setSelectedTeams([...selectedTeams, team]);
        setFilteredTeams([]);
    };

    const removeTeam = (indexToRemove) => {
        const newTeams = selectedTeams.filter((_, index) => index !== indexToRemove);
        setSelectedTeams(newTeams);
    };

    async function submitTeams(button, submittedTeams) {
        button.style.cursor = "wait";
        const data = { teams: submittedTeams, filterOptions: filterOptions };
        const response = await fetch('/api/requestHandler', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        sendDataUp(result.data.dataToDisplay);
        button.style.cursor = "default";
    }

    return (
        <div className="z-0 overflow-visible">
            <ul className="flex justify-items-start flex-wrap mt-10 mb-4  overflow-auto">
                {selectedTeams.map((team, index) => (
                    <li key={index} onClick={() => removeTeam(index)}>
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

                <div className="p-2 mt-3 ml-3 text-blue-600 underline cursor-pointer hover:text-blue-800" onClick={() => setShowFilterOptions(true)}>Filtern</div>

                {showFilterOptions && <FilterOptions filterOptions={filterOptions} setFilterOptions={setFilterOptions} />}
            </div>

            <div className="flex justify-end p-4 mb-10">
                <button
                    className={`p-2 rounded-lg mr-16 h-12 w-36 ${selectedTeams.length !== 0 ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300'}`}
                    onClick={(e) => selectedTeams.length !== 0 ? submitTeams(e.target, selectedTeams) : alert("Please have a favorite team!😟")}
                >
                    Go Ball!
                </button>
            </div>
        </div>
    );
};

export default SearchBar_backup;
