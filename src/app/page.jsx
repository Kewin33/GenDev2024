'use client';
import React, {useEffect, useRef, useState} from 'react';
import SearchBar_backup from "./components/searchBar.jsx";
import Image from "next/image";

const ComparisonTable = () => {
    const [tableData, setTableData] = useState({});
    const [loadCosts,setLoadCosts] = useState(true);
    const temp = (data) =>{
        setLoadCosts(!loadCosts)
        setTableData(data)
        setFirstSearch(0)
        console.log("test")
        //console.log(tableData.competitionsData)
        //console.log(tableData.competitionsData.map(comp => comp.subCompetitions));
        console.log(tableData.packageCount);
    }

    const [firstSearch, setFirstSearch] = useState(1)
    return (
        <div className="">
            <SearchBar_backup sendDataUp={temp}/>
            {
                tableData !== undefined && 'restCount' in tableData && tableData.restCount > 0?
                    <div className="text-red-600 flex">
                        <i className="material-icons p-2 mr-2">warning </i>
                        <div>
                            Die Kombination streamt die größtmögliche Anzahl an Spiele aber nicht alle! <br/>
                            Wähle bitte mehr Anbieter aus um die fehlende {tableData.restCount + 1} Spiele zu sehen.
                        </div>

                    </div> :""
            }
            {
                tableData !== undefined && 'competitionsData' in tableData && tableData.competitionsData.length > 0? (
                        <div className="overflow-x-scroll pt-10">
                            <Table tableData={tableData} loadCosts={loadCosts} />
                        </div>
                    ) : (
                        <div className="flex justify-around ">
                            <div className="flex flex-col">
                                {firstSearch === 0?
                                    <>
                                        <div className="p-4 text-center">Sorry! No Results found :( </div>
                                        <div> Vielleicht findest du <a className="text-blue-500" href="/help">hier </a> Hilfe ;)</div>
                                    </>
                                    :
                                    ""
                                }
                                <Image src="/images/logo.png" alt="Logo" width={350} height={150}/>
                            </div>
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
                <>
                    <th key={index} className={`overflow-visible border bg-gray-100 p-2 text-center relative ${tableData.packageCount[0] !== -1 && index === 0?"border-t-blue-800 border-t-4 bg-blue-200":tableData.packageCount[0] - 1 < index && index < tableData.packageCount[1]?"border-t-green-500 border-t-4 bg-green-100":""}`}>

                        {/*best kombi sign*/
                            tableData.packageCount[0] !== -1 && index === 0?
                                <div className="absolute pl-2 pr-2 pt-0.5 pb-0.5 rounded-2xl text-blue-700 text-xs bg-blue-300 -top-3 right-2 whitespace-nowrap">
                                    Ein Packet, alle Spiele :)
                                </div>:
                                tableData.packageCount[1] !== -1 && index === tableData.packageCount[0] +1?
                                <div>
                                    <div className="absolute pl-2 pr-2 pt-0.5 pb-0.5 rounded-2xl text-green-700 text-xs bg-green-300 -top-4 right-2 whitespace-nowrap">
                                        günstigste Kombi :)
                                    </div>
                                </div>:""
                        }
                        <div className="pt-4 whitespace-nowrap overflow-clip">
                            {service}
                        </div>
                        <div className="flex justify-center space-x-1 mt-1 pb-4">
                            <span className="flex p-2 rounded bg-gray-400">Live</span>
                            <span className="flex p-2 rounded bg-gray-400">Highl.</span>
                        </div>


                    </th>
                </>

            ))}
        </tr>
        <tr>

        </tr>
        </thead>
    )
}

function Table({tableData, loadCosts}) {
    const [openSections, setOpenSections] = useState({});
    const toggleSection = (competitionName) => {
        setOpenSections((prevState) => ({
            ...prevState,
            [competitionName]: !prevState[competitionName],
        }));
    };
    return (
        <table className="min-w-full border-collapse table-auto text-left text-sm">
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
                                    className={`inline-block w-4 h-4 rounded-full mr-4 ${competition.subCompetitions.every(s => s.liveHighlights[index].live === 1 || s.liveHighlights[index].live === -1) ? 'bg-green-500' : competition.subCompetitions.every(s => s.liveHighlights[index].live === 0 || s.liveHighlights[index].live === null || s.liveHighlights[index].live === -1) ?'bg-red-500': 'bg-amber-400'}`}></span>
                                <span
                                    className={`inline-block w-4 h-4 rounded-full ml-4 ${competition.subCompetitions.every(s => s.liveHighlights[index].highlights === 1 ||  s.liveHighlights[index].highlights === -1) ? 'bg-green-500' : competition.subCompetitions.every(s => s.liveHighlights[index].highlights === 0|| s.liveHighlights[index].highlights === null ||  s.liveHighlights[index].highlights === -1) ?'bg-red-500': 'bg-amber-400'}`}></span>
                            </td>
                        ))}


                    </tr>

                    {/* Dropdown für Unterwettbewerbe */}
                    {openSections[competition.tournament_name] && competition.subCompetitions.map((subComp, subIdx) => (
                        <tr key={subIdx} className="bg-gray-50">
                            <td className={`text-ms border border-gray-300 pl-6 p-2 text-center`}>
                                {subComp.team_home} <br/>
                                - <br/>
                                {subComp.team_away }
                                
                                <div className={` text-xs ${new Date(subComp.starts_at) > new Date()? "text-green-500": "text-gray-700"}`} >
                                    {"( " + new Date(subComp.starts_at).toLocaleDateString("de-DE", { year: "numeric", month: "long", day: "numeric" }) + " )"}
                                </div>
                            </td>
                            {subComp.liveHighlights.map((service, index) => (
                                <td key={index} className="border border-gray-300 p-2 text-center">
                                    {/* Beispiel für SubCompetition-Daten */}
                                    <span
                                        className={`inline-block w-4 h-4 rounded-full mr-4 ${service.live === -1? 'bg-gray-400': service.live ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                    <span
                                        className={`inline-block w-4 h-4 rounded-full ml-4 ${service.highlights === -1? 'bg-gray-400':service.highlights ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                </td>
                            ))}
                        </tr>
                    ))}
                </React.Fragment>
            ))}


            {/* Details Buttons */}
            <DetailsSection tableData={tableData} loadCosts = {loadCosts} className="absolute -top-96"/>
            </tbody>
        </table>
    )
}

const DetailsSection = ({ tableData, loadCosts }) => {
    //Streaming package Details
    const [showPopup, setShowPopup] = useState(null); // null means no popup is shown
    const popupRef = useRef(null); // Reference to the popup

    const [showCosts, setShowCosts] = useState(false); // null means no popup is shown
    const [costs, setCosts] = useState(Array(37).fill(null))


    const [streamingPackageDetails, setStreamingPackageDetails] = useState({})

    //get costs beforehand to avoid delay
    const fetchCosts = async () => {
        if(!showCosts){
            for (let [index, service] of tableData.streamingPackageNames.entries()) {
                await getCostOfStreamingPackage(service, index);
            }
        }
        setShowCosts(prevState => !prevState)

    }

    useEffect(()=>setShowCosts(false),[loadCosts])

    //hide and show popup
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
        //console.log(service);
        let response = await fetch('/api/getCostOfPackage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(service),
        });
        response =await response.json()
        setCosts(prevState => [
            ...prevState.slice(0, index),
            response.data,
            ...prevState.slice(index)
        ]);
        //console.log(costs);
        sessionStorage.setItem(index,JSON.stringify(response.data))
    }

    function openPopup(index){
        setStreamingPackageDetails(index)
        setShowPopup(index);
    }

    return (
        <>
            <tr className="p-2 mt-2 border-t-2 border-gray-600">
                <td className="border border-gray-300 p-4 text-center flex justify-between items-center cursor-pointer" onClick={fetchCosts}>
                    Details/Kosten der Anbieter
                    <span>{showCosts ? '▲' : '▼'}</span>
                </td>
                {tableData.streamingPackageNames.map((service, index) => (
                    <td key={index} className="border border-gray-300 bg-gray-100 p-4 text-center">
                        <span><a
                        href={"https://letmegooglethat.com/?q=" + encodeURIComponent(costs[index].name)}
                        className="bg-blue-500 rounded p-2 text-black" target="_blank">Zum Anbieter</a>
                        </span>
                    </td>
                ))}
            </tr>
            {/* Kosten rows */}
            {
                showCosts && (
                    <>
                        <tr className="border-t-2 border-gray-600">
                            <td className="border border-gray-300 bg-gray-100 p-2 text-center"> Monatsabo</td>
                            {tableData.streamingPackageNames.map((service, index) => (
                                <td key={index} className="relative border border-gray-300 bg-white p-2 text-center">
                                    <span>{costs[index].monthly_price_cents == null ? "Nicht verfügbar" : costs[index].monthly_price_cents / 100 + "€/Monat"} </span>
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td className="border border-gray-300 bg-gray-100 p-2 text-center"> Jahresabo</td>
                            {tableData.streamingPackageNames.map((service, index) => (
                                <td key={index} className="relative border border-gray-300 bg-white p-2 text-center">
                                    <span>{costs[index].monthly_price_yearly_subscription_in_cents / 100} €/Monat</span>
                                </td>
                            ))}
                        </tr>
                    </>

                )
            }


        </>
    );


};


export default ComparisonTable;


/*
            <tr className="z-50">


                <td className="border border-gray-300 bg-gray-100 p-2 text-center"> Details/Kosten der Anbieter</td>
                {tableData.streamingPackageNames.map((service, index) => (
                    <td key={index} className="relative border border-gray-300 bg-gray-100 p-2">

                        <div className="flex justify-center">
                            {showPopup === index && (
                                <div ref={popupRef}
                                     className="absolute  bottom-9 mb-2 bg-white p-2 border border-gray-300 shadow-lg  rounded-2xl z-50">
                                    <div className="p-2 ">
                                        <div className="flex justify-between mb-2">
                                            <span className="mr-4">Streaming Anbieter: </span>
                                            <span>{streamingPackageDetails.name}</span>
                                        </div>
                                        <div className="flex justify-between mb-2">
                                            <span className="mr-4">Monatsabo: </span>
                                            <span>{streamingPackageDetails.monthly_price_cents == null ? "Nicht verfügbar" : streamingPackageDetails.monthly_price_cents / 100 + "€/Monat"} </span>
                                        </div>
                                        <div className="flex justify-between mb-2">
                                            <span className="mr-4">Jahresabo: </span>
                                            <span>{streamingPackageDetails.monthly_price_yearly_subscription_in_cents / 100} €/Monat</span>
                                        </div>
                                        <div className="flex justify-between mb-2">
                                            <span className="mr-4">Link zum Anbieter: </span>
                                            <span><a href="https://m.youtube.com/watch?v=dQw4w9WgXcQ"
                                                     className="text-blue-700 underline" target="_blank">Hier</a></span>
                                        </div>
                                    </div>
                                </div>
                            )}

<button className="bg-blue-500 text-white py-1 px-3 rounded-md"
        onClick={() => openPopup(index)}>
    Details
</button>
</div>
</td>
))}
</tr>
 */


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