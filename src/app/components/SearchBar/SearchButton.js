import _ from "lodash";
import React from "react";

function SearchButton({loading, setLoading, selectedTeams, sendDataUp , filterOptions}){


    async function submitTeams (button, submittedTeams){
        //console.log(submittedTeams);
        setLoading(true)

        const data = { teams: submittedTeams, filterOptions: filterOptions };
        //console.log(data);

        //setting up search history
        const save = { teams: submittedTeams, ...filterOptions };
        let searchHistory = JSON.parse(localStorage.getItem('history')) || [];
        if (searchHistory.some(item => _.isEqual(item, save))) {
            searchHistory = searchHistory.filter(t => !_.isEqual(t, save)); // Entfernt das gleiche Objekt
        }
        searchHistory.push(save)
        if (searchHistory.length > 5) searchHistory.shift()
        localStorage.setItem('history', JSON.stringify(searchHistory));
        //end of setting search history

        const response = await fetch('/api/requestHandler', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        //console.log(result);
        sendDataUp(result.data.dataToDisplay)

        setLoading(false)

        //console.log(result.data.dataToDisplay);

    }
    return (
        <div className="flex justify-end p-4 mb-10">

            <button
                className={`p-2 rounded-lg mr-16 mt-8 h-12 w-36 ${selectedTeams.length !== 0 ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300'}`}
                onClick={(e) => {
                    selectedTeams.length !== 0
                        ? submitTeams(e.target, selectedTeams)
                        : alert("Please have a favorite team!😟");
                }}
            >
                Go Ball!
            </button>
            {/* loading sign */}
            <div>
                {
                    loading &&
                    <div className="absolute flex flex-col items-center justify-center float-left right-4 h-32">
                        <div
                            className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                        <p className="text-blue-500 text-sm font-medium">Lemme think🤔</p>
                    </div>
                }
            </div>


        </div>
    )
}
export default SearchButton