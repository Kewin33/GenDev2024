import React from "react";

function SelectedTeams({ selectedTeams, setSelectedTeams }) {
    // Function to remove a team from the selected teams list by its index
    const removeTeam = (indexToRemove) => {
        // Filter out the team at the specified index
        const newTeams = selectedTeams.filter((_, index) => index !== indexToRemove);
        setSelectedTeams(newTeams); // Update the selected teams state with the new list
    };

    return (
        <ul className="flex justify-items-start flex-wrap mt-10 mb-4 overflow-auto">
            {/* Iterate through the selected teams and display each one */}
            {selectedTeams.map((team, index) => (
                <li key={index} onClick={() => removeTeam(index)}> {/* Remove team on click */}
                    <span className="flex p-2 bg-gray-300 rounded ml-4 cursor-pointer hover:bg-gray-500 m-2">
                        {/* Icon and team name displayed here */}
                        <i className="material-icons">close</i>
                        {team}
                    </span>
                </li>
            ))}
        </ul>
    );
}

export default SelectedTeams;
