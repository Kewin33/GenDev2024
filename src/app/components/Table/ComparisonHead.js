import React from "react";

function ComparisonHead({ tableData }) {
    // Destructure the necessary fields from tableData
    const { streamingPackageNames, packageCount } = tableData;

    // Define conditions for the "best combination" and "cheapest combination" labels
    const isBestCombo = packageCount[0] !== -1;
    const isCheapestCombo = packageCount[1] !== -1;

    return (
        <thead>
        <tr>
            <th className="border border-gray-300 bg-gray-100 p-2 text-center">Wettbewerbe</th>
            {streamingPackageNames.map((service, index) => {
                // Check if this is the "best combination" or "cheapest combination" package
                const isBestPackage = isBestCombo && index === 0;
                const isCheapestPackage = isCheapestCombo && index === packageCount[0] + 1;

                // Determine the class for each package based on its index and package count
                const packageClass = isBestPackage
                    ? "border-t-blue-800 border-t-4 bg-blue-200"
                    : isCheapestPackage || index < tableData.packageCount[1]
                        ? "border-t-green-500 border-t-4 bg-green-100"
                        : "";

                return (
                    <th key={index} className={`overflow-visible border bg-gray-100 p-2 text-center relative ${packageClass}`}>
                        {/* Display best combination or cheapest combination sign */}
                        {isBestPackage && (
                            <div className="absolute pl-2 pr-2 pt-0.5 pb-0.5 rounded-2xl text-blue-700 text-xs bg-blue-300 -top-3 right-2 whitespace-nowrap">
                                Ein Paket, alle Spiele :)
                            </div>
                        )}
                        {isCheapestPackage && (
                            <div className="absolute pl-2 pr-2 pt-0.5 pb-0.5 rounded-2xl text-green-700 text-xs bg-green-300 -top-4 right-2 whitespace-nowrap">
                                Günstigste Kombi :)
                            </div>
                        )}


                        <div className="pt-4 whitespace-nowrap overflow-clip">
                            {service}
                        </div>


                        <div className="flex justify-center space-x-1 mt-1 pb-4">
                            <span className="flex p-2 rounded bg-gray-400">Live</span>
                            <span className="flex p-2 rounded bg-gray-400">Highl.</span>
                        </div>
                    </th>
                );
            })}
        </tr>
        <tr></tr>
        </thead>
    );
}

export default ComparisonHead;
