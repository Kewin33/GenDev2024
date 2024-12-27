import React, { useEffect, useRef, useState } from "react";

function Dropdown({ usage, optionData, oldData }) {
    // State for managing dropdown visibility
    const [isOpen, setIsOpen] = useState(false);
    // State for managing selected items
    const [selectedItems, setSelectedItems] = useState([]);
    // Ref for detecting clicks outside the dropdown
    const dropdownRef = useRef(null);
    // State for dropdown items
    const [items, setItems] = useState([]);
    // Variable to determine the API endpoint usage
    let u;

    // Initial setup based on the `usage` and `oldData` props
    useEffect(() => {
        console.log("Data from parent passed");
        if (usage.includes("Liga")) {
            u = "allTournaments"; // Set usage for tournaments
            if (oldData.tournamentName !== null) setSelectedItems(oldData.tournamentName);
        }
        if (usage.includes("Streaming")) {
            u = "allStreamingServices"; // Set usage for streaming services
            if (oldData.preferredStreamingPackages !== null) setSelectedItems(oldData.preferredStreamingPackages);
        }
    }, []); // Runs once on mount

    // Toggle dropdown visibility
    const toggleDropdown = () => setIsOpen(!isOpen);

    // Handle item selection
    async function handleItemClick(item) {
        let temp;

        console.log("Current filter options: " + selectedItems);
        console.log("Changing filter options: " + item);

        if (item.includes("Alle")) {
            temp = items.slice(2); // Select all items except the first two default options
        } else if (item.includes("Keine")) {
            temp = []; // Clear all selected items
        } else {
            // Toggle the selected item
            temp = selectedItems.includes(item)
                ? selectedItems.filter((i) => i !== item)
                : [...selectedItems, item];
        }

        await setSelectedItems(temp);
        optionData(temp); // Pass updated selection to parent
    }

    // Close dropdown if clicked outside
    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    // Fetch dropdown items based on the usage
    useEffect(() => {
        const fetchListData = async () => {
            const response = await fetch(`/api/getListOfAll?usage=${u}`, { method: 'GET' });
            const data = await response.json();

            console.log("Fetched data: " + data);
            // Add default options and update the items state
            await setItems([
                `--Alle ${usage.split('/')[1]} auswählen--`,
                `--Keine ${usage.split('/')[1]} auswählen--`,
                ...data,
            ]);

            // Pre-select items if applicable
            optionData(data);
            setSelectedItems(data);
        };

        fetchListData();
    }, []); // Runs once on mount

    // Add event listener for clicks outside the dropdown
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative inline-block text-left m-4" ref={dropdownRef}>
            {/* Dropdown toggle button */}
            <div>
                <button
                    onClick={toggleDropdown}
                    className="inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    {selectedItems.length > 0
                        ? selectedItems.length === 1
                            ? `${usage.split('/')[0]} gewählt`
                            : selectedItems.length + " " + usage.split('/')[1] + " gewählt"
                        : "Wähle " + usage.split('/')[1]}
                    <svg
                        className="-mr-1 ml-2 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>

            {/* Dropdown menu */}
            {isOpen && (
                <div className="absolute z-10 mt-2 w-full rounded-md bg-white shadow-lg">
                    <div className="max-h-60 rounded-md py-1 overflow-x-scroll">
                        {items.map((item) => (
                            <div
                                key={item}
                                onClick={() => handleItemClick(item)}
                                className={`cursor-pointer select-none relative py-2 pl-3 pr-9 overflow-x-visible w-64 ${
                                    selectedItems.includes(item) ? "bg-blue-100 text-blue-900" : "text-gray-900"
                                }`}
                            >
                                <span
                                    className={`block truncate ${
                                        selectedItems.includes(item) ? "font-medium" : "font-normal"
                                    }`}
                                >
                                    {item}
                                </span>
                                {selectedItems.includes(item) && (
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                        <svg
                                            className="h-3 w-3"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
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
