import React from 'react';
import Image from "next/image";

// Komponente für die Tabellenüberschrift (Header)
const TableHeader = ({teams}) => {
    return (
        <thead className="bg-gray-200">
        <tr>
            <th>
                Wettbewerbe deiner Favoriten
            </th>
            {teams.map((team, index) => (
                <th className="py-2 px-4 border-b" key={index} colSpan="2">
                    <div className="flex-col justify-center">
                        {/*<Image src={} alt={}></Image> missing*/}
                        <p className="">{team}</p>
                        <div className="flex justify-center">
                            <p className="p-2">live.</p>
                            <p className="p-2">High.</p>
                        </div>
                    </div>

                </th>
            ))}
        </tr>
        </thead>
    )};

// Komponente für eine einzelne Tabellenzeile (Row)
const TableRow = ({
    rowData
}) => {
    return (
        <tr className="hover:bg-gray-100">
            <td className="py-2 px-4 border-b">{rowData.id}</td>
            <td className="py-2 px-4 border-b">{rowData.name}</td>
            <td className="py-2 px-4 border-b">{rowData.age}</td>
            <td className="py-2 px-4 border-b">{rowData.city}</td>
        </tr>
    );
};

// Komponente für den Tabelleninhalt (Body)
const TableBody = ({ data }) => {
    return (
        <tbody>
        {data.map((row) => (
            <TableRow key={row.id} rowData={row} />
        ))}
        </tbody>
    );
};

// Hauptkomponente für die Tabelle
const Table = () => {
    const data = [
        { id: 1, name: 'Alice', age: 25, city: 'Berlin' },
        { id: 2, name: 'Bob', age: 30, city: 'Hamburg' },
        { id: 3, name: 'Charlie', age: 35, city: 'München' },
        { id: 4, name: 'David', age: 40, city: 'Köln' },
    ];
    const tableRowData = [
        "id","name" ,"age", "city"
    ]

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
                {/* Tabellenüberschrift */}
                <TableHeader teams = {tableRowData} />

                {/* Tabelleninhalt */}
                <TableBody data={data} />
            </table>
        </div>
    );
};

export default Table;
