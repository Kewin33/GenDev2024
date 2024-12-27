import React from "react";
import ComparisonHead from "./ComparisonHead.js";
import ComparisonBody from "./ComparisonBody.js";
import DetailsSection from "./DetailsSection.js";



function Table({tableData, loadCosts}) {

    return (
        <div className="overflow-x-scroll pt-10">
            <table className="min-w-full border-collapse table-auto text-left text-sm">
                <ComparisonHead tableData={tableData}/>
                <ComparisonBody tableData={tableData} loadCosts={loadCosts}/>
                <DetailsSection tableData={tableData} loadCosts={loadCosts} className="absolute -top-96"/>
            </table>
        </div>
    )
}

export default Table;