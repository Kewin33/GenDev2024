'use client';
import React, {useEffect, useRef, useState} from 'react';
import SearchBar from "./Components/searchBar.jsx";
import table from "../components/table.js";
import Image from "next/image";

const ComparisonTable = () => {
    const [tableData, setTableData] = useState({});
    const temp = (data) =>{
        setTableData(data)
        //console.log("entered temp")
        //console.log(tableData.competitionsData.map(comp => comp.subCompetitions));
    }
    return (
        <div className="overflow-auto">
            <SearchBar sendDataUp={temp}/>
            {
                Object.keys(tableData).length > 0 ? (
                        <div className="p-4 overflow-visible z-50">
                            <Table tableData={tableData} />
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <Image src="/images/logo.png" alt="Logo" width={350} height={150} />
                        </div>
                    )
            }
        </div>
    );

};


function ComparisonHead({tableData}) {
    return (
        <thead>
        <tr>
            <th className="border border-gray-300 bg-gray-100 p-2 text-center">Wettbewerbe</th>
            {tableData.streamingPackageNames.map((service, index) => (
                <th key={index} className={`border border-gray-300 bg-gray-100 p-2 text-center relative `}>
                    {service}
                    <div className="flex justify-center space-x-1 mt-1">
                        <span className="flex">Live</span>
                        <span className="flex">Highl.</span>
                    </div>
                </th>
            ))}
        </tr>
        <tr>

        </tr>
    </thead>
    )
}

function Table({tableData}){
    const [openSections, setOpenSections] = useState({});
    const toggleSection = (competitionName) => {
        setOpenSections((prevState) => ({
            ...prevState,
            [competitionName]: !prevState[competitionName],
        }));
    };
    return (
        <table className="relative min-w-full border-collapse table-auto text-left text-sm overflow-visible">
            <ComparisonHead tableData={tableData}/>
            <tbody>
            {tableData.competitionsData.map((competition, idx) => (
                <React.Fragment key={idx}>
                    <tr onClick={() => toggleSection(competition.tournament_name)} className="cursor-pointer">
                        <td className="border border-gray-300 p-2">
                            <div className="flex justify-between items-center">
                                <span>{competition.tournament_name}</span>
                                <span>{openSections[competition.tournament_name] ? '▲' : '▼'}</span>
                            </div>
                        </td>

                        {tableData.streamingPackageNames.map((comp, index) => (
                            <td key={index} className="border border-gray-300 p-2 text-center">
                                <span
                                    className={`inline-block w-4 h-4 rounded-full ${competition.subCompetitions.every(s => s.liveHighlights[index].live === 1) ? 'bg-green-500' : competition.subCompetitions.every(s => s.liveHighlights[index].live === 0 || s.liveHighlights[index].live === null) ?'bg-red-500': 'bg-amber-400'}`}></span>
                                <span
                                    className={`inline-block w-4 h-4 rounded-full ml-2 ${competition.subCompetitions.every(s => s.liveHighlights[index].highlights === 1) ? 'bg-green-500' : competition.subCompetitions.every(s => s.liveHighlights[index].highlights === 0|| s.liveHighlights[index].highlights === null) ?'bg-red-500': 'bg-amber-400'}`}></span>
                            </td>
                        ))}


                    </tr>

                    {/* Dropdown für Unterwettbewerbe */}
                    {openSections[competition.tournament_name] && competition.subCompetitions.map((subComp, subIdx) => (
                        <tr key={subIdx} className="bg-gray-50">
                            <td className="border border-gray-300 pl-6 p-2">{subComp.team_home + "-" + subComp.team_away}</td>
                            {subComp.liveHighlights.map((service, index) => (
                                <td key={index} className="border border-gray-300 p-2 text-center">
                                    {/* Beispiel für SubCompetition-Daten */}
                                    <span
                                        className={`inline-block w-4 h-4 rounded-full ${service.live ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                    <span
                                        className={`inline-block w-4 h-4 rounded-full ml-2 ${service.highlights ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                </td>
                            ))}
                        </tr>
                    ))}
                </React.Fragment>
            ))}

            {/* Details Buttons */}
            <DetailsSection tableData={tableData}/>
            </tbody>
        </table>
    )
}

const DetailsSection = ({ tableData }) => {
    //Streaming package Details
    const [showPopup, setShowPopup] = useState(null); // null means no popup is shown
    const popupRef = useRef(null); // Reference to the popup

    const [streamingPackageDetails,setStreamingPackageDetails] = useState({})



    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setShowPopup(null); // Hide popup if clicked outside
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    async function getCostOfStreamingPackage(service, index){
        // Set the popup to show on the clicked index
        setShowPopup(index);
        console.log(service);
        let response = await fetch('/api/getCostOfPackage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(service),
        });
        response =await response.json()
        setStreamingPackageDetails(response.data)
    }

    return (
            <tr className="overflow-visible z-50">
                <td className="border border-gray-300 bg-gray-100 p-2 text-center"> Details</td>
                {tableData.streamingPackageNames.map((service, index) => (
                    <td key={index} className="relative border border-gray-300 bg-gray-100 p-2">

                        <div className="flex justify-center">
                            {showPopup === index && (
                                <div ref={popupRef}
                                     className="absolute  bottom-9 mb-2 bg-white p-2 border border-gray-300 shadow-lg  rounded-2xl overflow-visible z-50">
                                    <div className="p-2">
                                        <div className="flex justify-between mb-2">
                                            <span className="mr-4">Streaming Anbieter: </span>
                                            <span>{streamingPackageDetails.name}</span>
                                        </div>
                                        <div className="flex justify-between mb-2">
                                            <span className="mr-4">Monatsabo: </span>
                                            <span>{streamingPackageDetails.monthly_price_cents / 100} €/Monat</span>
                                        </div>
                                        <div className="flex justify-between mb-2">
                                            <span className="mr-4">Jahresabo: </span>
                                            <span>{streamingPackageDetails.monthly_price_yearly_subscription_in_cents / 100} €/Monat</span>
                                        </div>
                                        <div className="flex justify-between mb-2">
                                            <span className="mr-4">Link zum Anbieter: </span>
                                            <span><a href="https://m.youtube.com/watch?v=dQw4w9WgXcQ" className="text-blue-700 underline" target="_blank">Hier</a></span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Details button */}
                            <button className="bg-blue-500 text-white py-1 px-3 rounded-md"
                                    onClick={() => getCostOfStreamingPackage(service, index)}>
                                Details
                            </button>
                        </div>
                    </td>
                ))}
            </tr>
    );


};


export default ComparisonTable;


{/*
<tr>
                <td className="border border-gray-300 bg-gray-100 p-2 text-center"> Details</td>
                {tableData.streamingPackageNames.map((service, index) => (
                    //const [showDetails,setShowDetails] = useState(0)
                    <td key={index} className="relative border border-gray-300 bg-gray-100 p-2 text-center">
                        <div className="flex flex-col absolute bottom-9 w-full left-1/7 p-4 bg-gray-200  rounded-2xl border-2">
                            <i className="material-icons ">close</i>
                            <div>
                                Hello
                            </div>
                        </div>
                        <button className="bg-blue-500 text-white py-1 px-3 rounded-md"
                                onClick={() => getCostOfStreamingPackage(service)}>Details
                        </button>

                    </td>

                ))}
            </tr>
*/
}