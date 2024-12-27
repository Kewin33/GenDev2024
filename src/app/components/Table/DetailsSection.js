import React, { useEffect, useState } from "react";

const DetailsSection = ({ tableData, loadCosts }) => {
    // Streaming package details

    const [showCosts, setShowCosts] = useState(false); // null means no popup is shown
    const [costs, setCosts] = useState(Array(37).fill({ name: "" }));

    // Function to toggle the costs popup visibility
    function openCosts() {
        setShowCosts(prevState => !prevState);
    }

    // Get costs beforehand to avoid delay
    const fetchCosts = async () => {
        // Loop through the streaming package names and fetch the costs for each one
        for (let [index, service] of tableData.streamingPackageNames.entries()) {
            await getCostOfStreamingPackage(service, index);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setShowCosts(false); // Hide the costs initially
            setCosts(Array(37).fill({ name: "" })); // Reset the costs array
            await fetchCosts(); // Fetch the costs
            setShowCosts(true); // Show the costs after loading
        };
        fetchData(); // Fetch the data when the component mounts or loadCosts changes
    }, [loadCosts]);

    // Function to fetch the cost of a streaming package
    async function getCostOfStreamingPackage(service, index) {
        let response = await fetch('/api/getCostOfPackage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(service),
        });

        response = await response.json(); // Parse the response
        // Update the costs state by inserting the fetched data at the correct index
        setCosts(prevState => [
            ...prevState.slice(0, index),
            response.data,
            ...prevState.slice(index)
        ]);
        // Store the fetched cost data in sessionStorage for later use
    }

    return (
        <>
            {showCosts && (
                <>
                    {/* Monatsabo row */}
                    <tr className="border-t-2 border-gray-600">
                        <td className="border border-gray-300 bg-gray-100 p-2 text-center">Monatsabo</td>
                        {tableData.streamingPackageNames.map((service, index) => (
                            <td key={index} className="relative border border-gray-300 bg-white p-2 text-center">
                                <span>
                                    {costs[index].monthly_price_cents == null
                                        ? "Nicht verfügbar"
                                        : `${costs[index].monthly_price_cents / 100} €/Monat`}
                                </span>
                            </td>
                        ))}
                    </tr>
                    {/* Jahresabo row */}
                    <tr>
                        <td className="border border-gray-300 bg-gray-100 p-2 text-center">Jahresabo</td>
                        {tableData.streamingPackageNames.map((service, index) => (
                            <td key={index} className="relative border border-gray-300 bg-white p-2 text-center">
                                <span>{costs[index].monthly_price_yearly_subscription_in_cents / 100} €/Monat</span>
                            </td>
                        ))}
                    </tr>
                </>
            )}

            {/* Mehr Details button row */}
            <tr className="p-2 mt-2 border-t-2 border-gray-600">
                <td className="border border-gray-300 p-4 flex text-center justify-between items-center cursor-pointer" onClick={openCosts}>
                    Mehr Details
                </td>
                {tableData.streamingPackageNames.map((service, index) => (
                    <td key={index} className="border border-gray-300 bg-gray-100 p-4 text-center">
                        <span>
                            <a
                                href={"https://letmegooglethat.com/?q=" + encodeURIComponent(costs[index].name) || ""}
                                className="bg-blue-500 rounded p-2 text-black whitespace-nowrap"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Zum Anbieter
                            </a>
                        </span>
                    </td>
                ))}
            </tr>
        </>
    );
};

export default DetailsSection;
