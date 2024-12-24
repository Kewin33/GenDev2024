import React from 'react';
import Dropdown from './Dropdown'; // Importiere Dropdown-Komponente

const FilterOptions = ({ filterOptions, setFilterOptions }) => {

    const setTime = (e) => {
        const time = e.target.id;
        const value = e.target.value;
        if (time === "timeFrom") {
            const timeUntil = filterOptions.timeUntil;
            if (timeUntil && timeUntil < value) {
                alert("You wanna travel through time?!");
                return;
            }
            setFilterOptions({ ...filterOptions, timeFrom: value });
        }
        if (time === "timeUntil") {
            const timeFrom = filterOptions.timeFrom;
            if (timeFrom && timeFrom > value) {
                alert("You wanna travel through time?!");
                return;
            }
            setFilterOptions({ ...filterOptions, timeUntil: value });
        }
    };

    return (
        <div className="fixed overflow-auto inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-4 rounded-lg">
                <h2 className="text-lg">Filter Options</h2>
                <p className="mb-2">Hier sind Ihre Filteroptionen.</p>
                <div className="flex flex-col justify-between">
                    Von <input
                    id="timeFrom"
                    type="date"
                    value={filterOptions.timeFrom}
                    onChange={setTime}
                    className="border rounded bg-gray-300 p-1 m-4"
                />
                    Bis <input
                    id="timeUntil"
                    type="date"
                    value={filterOptions.timeUntil}
                    onChange={setTime}
                    className="border rounded bg-gray-300 p-1 m-4"
                />
                    <Dropdown usage="Eine Liga/Ligen" optionData={(data) => setFilterOptions({ ...filterOptions, tournamentName: data })} oldData={filterOptions} />
                    <Dropdown usage=" Einen Streaming Anbieter/Streaming Anbieter" optionData={(data) => setFilterOptions({ ...filterOptions, preferredStreamingPackages: data })} oldData={filterOptions} />
                </div>

                <div className="flex justify-evenly">
                    <button className="mt-4 p-2 bg-red-500 rounded-lg shadow">
                        Schließen
                    </button>
                    <button className="mt-4 p-2 bg-blue-500 rounded-lg shadow">
                        Anwenden
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterOptions;
