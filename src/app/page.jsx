'use client';
import React, {useEffect, useRef, useState} from 'react';
import SearchBar from "./components/SearchBar/searchBar.jsx";
import Image from "next/image";
import Table from "./components/Table/Table.js";

const Page = () => {
    const [tableData, setTableData] = useState({});
    const [loadCosts,setLoadCosts] = useState(true);
    const [firstSearch, setFirstSearch] = useState(1)
    const [error, setError] = useState(null);

    const temp = (data) =>{
        try {
            setLoadCosts(prev => !prev);  // Toggle loadCosts state more directly
            setFirstSearch(0)
            setTableData(data);
            setError(null);
        } catch (err) {
            setError("An error occurred while fetching the data. Please try again later."); // Set error message
            console.error("Error fetching data:", err);
        }
    }

    return (
        <div className="">
            <SearchBar sendDataUp={temp}/>
            <Warning tableData={tableData} error={error}/>

            {
                tableData?.competitionsData?.length > 0 ?
                    (<Table tableData={tableData} loadCosts={loadCosts} />) :
                    (<BallWatchLogo firstSearch={firstSearch}/>)
            }
        </div>
    );

};


function Warning({tableData, error}) {
    if(error) return (
        <div className="text-red-600 text-center p-4">
            {error}
        </div>
    )
    return tableData?.restCount > 0 ? (
        <div className="text-red-600 flex">
            <i className="material-icons p-2 mr-2">warning</i>
            <div>
                Die Kombination streamt die größtmögliche Anzahl an Spielen, aber nicht alle! <br/>
                Wähle bitte mehr Anbieter aus, um die fehlende {tableData.restCount} Spiele zu sehen.
            </div>
        </div>
    ) : null;
}

function BallWatchLogo({firstSearch}){
    return (
        <div className="flex justify-around ">
            <div className="flex flex-col">
                {firstSearch === 0?
                    <div className="flex flex-col">
                        <div className="p-4 text-center">Sorry! No Results found :( </div>
                        <div className="text-center"> Vielleicht findest du <a className="text-blue-500" href="/help">hier </a> Hilfe ;)</div>
                    </div>
                    :
                    ""
                }
                <Image src="/images/logo.png" alt="Logo" width={350} height={150}/>
            </div>
        </div>
    )
}

export default Page;
