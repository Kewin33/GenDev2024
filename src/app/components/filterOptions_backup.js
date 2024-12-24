import React, { useState, useEffect, useRef } from 'react';
import Dropdown from './Dropdown.js'; // Importiere die FilterOptions-Komponente

function FilterOptions({ filterOptions, setFilterOptions, closeFilterOptions }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);

    const dropdownRef = useRef(null);

    useEffect(() => {
        setSelectedItems(filterOptions.tournamentName || filterOptions.preferredStreamingPackages || []);
    }, [filterOptions]);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleItemClick = (item) => {
        let temp = selectedItems.includes(item) ? selectedItems.filter(i => i !== item) : [...selectedItems, item];
        setSelectedItems(temp);
        if (filterOptions.tournamentName) {
            setFilterOptions({ ...filterOptions, tournamentName: temp });
        } else if (filterOptions.preferredStreamingPackages) {
            setFilterOptions({ ...filterOptions, preferredStreamingPackages: temp });
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('/api/getListOfAll?usage=allTournaments', { method: 'GET' });
            const data = await response.json();
            setSelectedItems(data);
        };
        fetchData();
    }, []);

    return (
        <>
        <div className="p-2 mt-3 ml-3 text-blue-600 underline cursor-pointer hover:text-blue-800"
             onClick={() => openFilterOptions()}>Filtern
        </div>
        <div
            className={`fixed overflow-auto inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ${showFilterOptions ? '' : "hidden"}`}>
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
                    <Dropdown usage=" Einen Streaming Anbieter/Streaming Anbieter" optionData={streamingNameData}
                              oldData={filterOptions}/>
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

        </>
    );
}

export default FilterOptions;
