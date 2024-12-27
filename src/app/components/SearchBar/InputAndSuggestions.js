import React, { useEffect, useState } from "react";

function InputAndSuggestion({
                                teams,
                                setSelectedTeams,
                                selectedTeams,
                                openHistoryOptions,
                                openFilterOptions,
                                selectTeamEvent
                            }) {
    const [searchTerm, setSearchTerm] = useState(""); // State to store the input search term
    const [filteredTeams, setFilteredTeams] = useState([]); // State to store the filtered teams based on the search

    // Effect hook to handle selection when a team event occurs
    useEffect(() => {
        const fetchTeam = async () => {
            if (selectTeamEvent !== "") {
                await handleSelectTeam(selectTeamEvent); // Select the team if an event occurs
            }
        };
        fetchTeam();
    }, [selectTeamEvent]); // Runs every time `selectTeamEvent` changes

    // Handle the search input and filter the teams
    const handleSearch = async (e) => {
        setSearchTerm(e.target.value); // Update the search term state
        if (e.target.value === "") {
            setFilteredTeams([]); // Clear the filtered teams if the search term is empty
        } else {
            // Filter teams based on the search term and selected teams
            const filtered = teams.filter((team) =>
                team.toLowerCase().includes(e.target.value.toLowerCase()) &&
                !(selectedTeams.includes(team)) // Exclude already selected teams
            );
            setFilteredTeams(filtered); // Update the filtered teams state
        }
    };

    // Handle selecting a team from the dropdown
    const handleSelectTeam = async (team) => {
        setSearchTerm(""); // Clear the search term input after selecting a team

        // Update the selected teams based on the selected team
        setSelectedTeams((prevSelectedTeams) => {
            if (team === '--Alle auswählen--') {
                return ["Alle ausgewählt"]; // Select all teams if the "Select All" option is chosen
            } else if (team === '--Keine auswählen--') {
                return []; // Deselect all teams if the "Deselect All" option is chosen
            } else if (!prevSelectedTeams.includes("Alle ausgewählt")) {
                return [...prevSelectedTeams, team]; // Add the selected team to the list of selected teams
            }
            return prevSelectedTeams; // Return the unchanged selected teams if it's already in the list
        });

        setFilteredTeams([]); // Clear the filtered teams after selection
    };

    return (
        <div className="relative flex max-w-md mx-auto p-4">
            {/* Input field to search for teams */}
            <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Select favorite football teams..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Dropdown list showing the filtered teams */}
            {filteredTeams.length > 0 && (
                <ul className="top-16 absolute w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-48 shadow-lg overflow-y-scroll z-50">
                    {filteredTeams.map((team, index) => (
                        <li
                            key={index}
                            onClick={() => handleSelectTeam(team)} // Handle selection when a team is clicked
                            className="cursor-pointer p-3 hover:bg-blue-500 hover:text-white"
                        >
                            {team} {/* Display the team name */}
                        </li>
                    ))}
                </ul>
            )}

            {/* Buttons for opening history and filter options */}
            <div className="flex-col">
                <div
                    className="absolute top-16 right-8 p-2 ml-4 text-blue-600 underline cursor-pointer hover:text-blue-800"
                    onClick={() => openHistoryOptions()} // Trigger the history options when clicked
                >
                    Verlauf
                </div>
                <div
                    className="absolute top-16 left-4 p-2 ml-4 text-blue-600 underline cursor-pointer hover:text-blue-800"
                    onClick={() => openFilterOptions()} // Trigger the filter options when clicked
                >
                    Filtern
                </div>
            </div>
        </div>
    );
}

export default InputAndSuggestion;
