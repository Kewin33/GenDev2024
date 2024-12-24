'use client';
import React, { useState } from 'react';
import {competitionsData, services} from './data.json'
import SearchBar_backup from "./components/searchBar.jsx";

const ComparisonTable = () => {
    const [openSections, setOpenSections] = useState({});

    const toggleSection = (competitionName) => {
        setOpenSections((prevState) => ({
            ...prevState,
            [competitionName]: !prevState[competitionName],
        }));
    };

    return (
        <>
            <SearchBar_backup/>
            <div className="overflow-x-auto p-4">
                <table className="min-w-full border-collapse table-auto text-left text-sm">
                    <ComparisonHead/>
                    <tbody>
                    {competitionsData.map((competition, idx) => (
                        <React.Fragment key={idx}>
                            <tr onClick={() => toggleSection(competition.name)} className="cursor-pointer">
                                <td className="border border-gray-300 p-2">
                                    <div className="flex justify-between items-center">
                                        <span>{competition.name}</span>
                                        <span>{openSections[competition.name] ? '▲' : '▼'}</span>
                                    </div>
                                </td>
                                {services.map((service, index) => (
                                    <td key={index} className="border border-gray-300 p-2 text-center">
                                        {/* Kombinierte Icons für Live/Highlight */}
                                        <span className={`inline-block w-4 h-4 rounded-full ${service.live ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                        <span className={`inline-block w-4 h-4 rounded-full ml-2 ${service.highlights ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                    </td>
                                ))}
                            </tr>

                            {/* Dropdown für Unterwettbewerbe */}
                            {openSections[competition.name] && competition.subCompetitions.map((subComp, subIdx) => (
                                <tr key={subIdx} className="bg-gray-50">
                                    <td className="border border-gray-300 pl-6 p-2">{subComp}</td>
                                    {services.map((service, index) => (
                                        <td key={index} className="border border-gray-300 p-2 text-center">
                                            {/* Beispiel für SubCompetition-Daten */}
                                            <span className={`inline-block w-4 h-4 rounded-full ${service.live ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                            <span className={`inline-block w-4 h-4 rounded-full ml-2 ${service.highlights ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </React.Fragment>
                    ))}

                    {/* Details Buttons */}
                    <tr>
                        <td className="border border-gray-300 bg-gray-100 p-2 text-center"></td>
                        {services.map((service, index) => (
                            <td key={index} className="border border-gray-300 bg-gray-100 p-2 text-center">
                                <button className="bg-blue-500 text-white py-1 px-3 rounded-md">Details</button>
                            </td>
                        ))}
                    </tr>
                    </tbody>
                </table>
            </div>
        </>
    );

};


function ComparisonHead() {
    return (
        <thead>
        <tr>
            <th className="border border-gray-300 bg-gray-100 p-2 text-center">Wettbewerbe</th>
            {services.map((service, index) => (
                <th
                    key={index}
                    className={`border border-gray-300 bg-gray-100 p-2 text-center relative ${
                        service.bestCombination ? 'border-blue-500' : ''
                    }`}
                >
                    {service.bestCombination && (
                        <div
                            className="absolute top-[-20px] left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-2 py-1 rounded-md">
                            Beste Kombination
                        </div>
                    )}
                    {service.name}
                    <div className="flex justify-center space-x-1 mt-1">
                        <span className={`text-xs ${service.live ? 'text-green-500' : 'text-red-500'}`}>Live</span>
                        <span className={`text-xs ${service.highlights ? 'text-green-500' : 'text-red-500'}`}>Highl.</span>
                    </div>
                </th>
            ))}
        </tr>
        <tr>

        </tr>
    </thead>
    )
}

export default ComparisonTable;
