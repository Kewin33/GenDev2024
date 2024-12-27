'use client';
import React, { useEffect, useState } from "react";
import SelectedTeams from "./SelectedTeams.js";
import InputAndSuggestion from "./InputAndSuggestions.js";
import SearchButton from "./SearchButton.js";
import FilterOptions from "./FilterOptions.js";
import History from "./History.js";

const SearchBar = ({ sendDataUp }) => {
    // Fetch all teams once when the component mounts
    useEffect(() => {
        const fetchTeams = async () => {
            // Fetch data from the API route
            const response = await fetch('/api/getListOfAll?usage=allGames', { method: 'GET' });
            const data = await response.json();
            // Add default options and update the state
            setTeams(['--Alle auswählen--', '--Keine auswählen--', ...data]);
        };
        fetchTeams(); // Call the function
    }, []); // Empty dependency array ensures it runs only once

    // State for selected teams
    const [selectedTeams, setSelectedTeams] = useState([]);
    // State for all teams fetched from the API
    const [teams, setTeams] = useState([]);
    // State to toggle the filter options popup
    const [showFilterOptions, setShowFilterOptions] = useState(false);
    // State to store the filter options
    const [filterOptions, setFilterOptions] = useState({
        timeFrom: "",
        timeUntil: "",
        live: true,
        highlight: false,
        abo: "2", // 0 for monthly, 1 for yearly, 2 for any
        preferredStreamingPackages: [],
        tournamentName: [],
    });

    // Function to open filter options
    const openFilterOptions = () => {
        setShowFilterOptions(true);
    };

    // Function to close filter options with validations
    const closeFilterOptions = () => {
        if (filterOptions.preferredStreamingPackages.length === 0) {
            alert("No streaming services selected :(");
        } else if (filterOptions.tournamentName.length === 0) {
            alert("No leagues selected :(");
        } else {
            setShowFilterOptions(false);
        }
    };

    // State to toggle the history popup
    const [openHistory, setOpenHistory] = useState(false);

    // Function to open history popup
    function openHistoryOptions() {
        setOpenHistory(true);
    }

    // Function to close history popup
    function closeHistoryOptions() {
        setOpenHistory(false);
    }

    // State to manage the loading status
    const [loading, setLoading] = useState(false);

    // State to store the history
    const [history, setHistory] = useState([]);

    // State to manage the selected team event
    const [selectTeamEvent, setSelectTeamEvent] = useState("");

    // Async function to handle team selection
    async function handleSelectTeam(team) {
        await setSelectTeamEvent(team);
    }

    return (
        <div className="overflow-visible">
            {/* Component to display selected teams */}
            <SelectedTeams setSelectedTeams={setSelectedTeams} selectedTeams={selectedTeams} />

            {/* Component for input and suggestions */}
            <InputAndSuggestion
                teams={teams}
                setSelectedTeams={setSelectedTeams}
                selectedTeams={selectedTeams}
                openHistoryOptions={openHistoryOptions}
                openFilterOptions={openFilterOptions}
                selectTeamEvent={selectTeamEvent}
            />

            {/* Search button */}
            <SearchButton
                loading={loading}
                setLoading={setLoading}
                selectedTeams={selectedTeams}
                sendDataUp={sendDataUp}
                filterOptions={filterOptions}
            />

            {/* Filter options popup */}
            <FilterOptions
                showFilterOptions={showFilterOptions}
                closeFilterOptions={closeFilterOptions}
                setFilterOptions={setFilterOptions}
                filterOptions={filterOptions}
            />

            {/* History popup */}
            <History
                handleSelectTeam={handleSelectTeam}
                filterOptions={filterOptions}
                setFilterOptions={setFilterOptions}
                closeHistoryOptions={closeHistoryOptions}
                openHistory={openHistory}
                history={history}
                setHistory={setHistory}
            />
        </div>
    );
};

export default SearchBar;
