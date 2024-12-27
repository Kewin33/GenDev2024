import React, { useState } from "react";

function ComparisonBody({ tableData, loadCosts }) {
    // State to manage which sections (competitions) are open
    const [openSections, setOpenSections] = useState({});

    // Function to toggle the visibility of a competition's details
    const toggleSection = (competitionName) => {
        setOpenSections((prevState) => ({
            ...prevState,
            [competitionName]: !prevState[competitionName],
        }));
    };

    return (
        <tbody>
        {/* Loop through competitions data */}
        {tableData.competitionsData.map((competition, idx) => (
            <React.Fragment key={idx}>
                {/* Row for competition name and toggle icon */}
                <tr onClick={() => toggleSection(competition.tournament_name)} className="cursor-pointer">
                    <td className="border border-gray-300 p-2">
                        <div className="flex justify-between items-center">
                            <span>{competition.tournament_name}</span>
                            {/* Toggle icon: shows ▲ when open, ▼ when closed */}
                            <span>{openSections[competition.tournament_name] ? '▲' : '▼'}</span>
                        </div>
                    </td>

                    {/* Loop through streaming package names for each competition */}
                    {tableData.streamingPackageNames.map((comp, index) => (
                        <td key={index} className="border border-gray-300 p-2 text-center">
                            {/* Live status (green, red, or amber) for each streaming package */}
                            <span
                                className={`inline-block w-4 h-4 rounded-full mr-4 ${
                                    competition.subCompetitions.every(
                                        (s) => s.liveHighlights[index].live === 1 || s.liveHighlights[index].live === -1
                                    )
                                        ? 'bg-green-500'
                                        : competition.subCompetitions.every(
                                            (s) => s.liveHighlights[index].live === 0 || s.liveHighlights[index].live === null || s.liveHighlights[index].live === -1
                                        )
                                            ? 'bg-red-500'
                                            : 'bg-amber-400'
                                }`}
                            ></span>

                            {/* Highlights status (green, red, or amber) */}
                            <span
                                className={`inline-block w-4 h-4 rounded-full ml-4 ${
                                    competition.subCompetitions.every(
                                        (s) => s.liveHighlights[index].highlights === 1 || s.liveHighlights[index].highlights === -1
                                    )
                                        ? 'bg-green-500'
                                        : competition.subCompetitions.every(
                                            (s) => s.liveHighlights[index].highlights === 0 || s.liveHighlights[index].highlights === null || s.liveHighlights[index].highlights === -1
                                        )
                                            ? 'bg-red-500'
                                            : 'bg-amber-400'
                                }`}
                            ></span>
                        </td>
                    ))}
                </tr>

                {/* Dropdown for showing sub-competitions when the section is open */}
                {openSections[competition.tournament_name] &&
                    competition.subCompetitions.map((subComp, subIdx) => (
                        <tr key={subIdx} className="bg-gray-50">
                            <td className="text-ms border border-gray-300 pl-6 p-2 text-center">
                                {/* Home and away team names */}
                                {subComp.team_home} <br />
                                - <br />
                                {subComp.team_away}

                                {/* Start date of the sub-competition */}
                                <div
                                    className={`text-xs ${
                                        new Date(subComp.starts_at) > new Date() ? 'text-green-500' : 'text-gray-700'
                                    }`}
                                >
                                    {'( ' +
                                        new Date(subComp.starts_at).toLocaleDateString('de-DE', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        }) +
                                        ' )'}
                                </div>
                            </td>

                            {/* Loop through live highlights data for sub-competitions */}
                            {subComp.liveHighlights.map((service, index) => (
                                <td key={index} className="border border-gray-300 p-2 text-center">
                                    {/* Live status (green, red, or gray) */}
                                    <span
                                        className={`inline-block w-4 h-4 rounded-full mr-4 ${
                                            service.live === -1 ? 'bg-gray-400' : service.live ? 'bg-green-500' : 'bg-red-500'
                                        }`}
                                    ></span>

                                    {/* Highlights status (green, red, or gray) */}
                                    <span
                                        className={`inline-block w-4 h-4 rounded-full ml-4 ${
                                            service.highlights === -1 ? 'bg-gray-400' : service.highlights ? 'bg-green-500' : 'bg-red-500'
                                        }`}
                                    ></span>
                                </td>
                            ))}
                        </tr>
                    ))}
            </React.Fragment>
        ))}
        </tbody>
    );
}

export default ComparisonBody;
