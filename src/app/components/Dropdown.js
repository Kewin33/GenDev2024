import React, { useState, useEffect, useRef } from 'react';

function Dropdown({ usage, optionData, oldData }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const dropdownRef = useRef(null);

    let u;
    useEffect(() => {
        if (usage.includes("Liga")) {
            u = "allTournaments";
            if (oldData.tournamentName !== null) setSelectedItems(oldData.tournamentName);
        }
        if (usage.includes("Streaming")) {
            u = "allStreamingServices";
            if (oldData.preferredStreamingPackages !== null) setSelectedItems(oldData.preferredStreamingPackages);
        }
    }, [usage, oldData]);

    const toggleDropdown = () => setIsOpen(!isOpen);

    async function handleItemClick(item) {
        let temp = selectedItems.includes(item) ? selectedItems.filter((i) => i !== item) : [...selectedItems, item];
        await setSelectedItems(temp);
        optionData(temp);
    }

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchListData = async () => {
            const response = await fetch('/api/getListOfAll?usage=' + u, { method: 'GET' });
            const data = await response.json();
            setItems(data);
            setSelectedItems(data);
            optionData(data);
        };
        fetchListData();
    }, [u, optionData]);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative inline-block text-left m-4" ref={dropdownRef}>
            <div>
                <button
                    onClick={toggleDropdown}
                    className="inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    {selectedItems.length > 0 ? selectedItems.length === 1 ? `${usage.split('/')[0]} gewählt` : selectedItems.length + " " + usage.split('/')[1] + ' Ligen gewählt' : 'Wähle ' + usage.split('/')[1]}
                    <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>

            {isOpen && (
                <div className="absolute z-10 mt-2 w-full rounded-md bg-white shadow-lg">
                    <div className="max-h-60 rounded-md py-1 overflow-x-scroll">
                        {items.map((item) => (
                            <div
                                key={item}
                                onClick={() => handleItemClick(item)}
                                className={`cursor-pointer select-none relative py-2 pl-3 pr-9 overflow-x-visible w-64 ${
                                    selectedItems.includes(item) ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                                }`}
                            >
                                <span className={`block truncate ${selectedItems.includes(item) ? 'font-medium' : 'font-normal'}`}>
                                    {item}
                                </span>
                                {selectedItems.includes(item) && (
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M9 12l2 2l4 -4M21 12H3" />
                                        </svg>
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dropdown;
