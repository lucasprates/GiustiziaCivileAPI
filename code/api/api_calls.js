//api_calls.js
//This file contains all the possible calls that can be done by the user to retrieve information from Giustizia Civile

'use strict';

var giustiziaCivileAPI = require("./giustiziaCivileAPI");
var dataParserGC = require("./dataParserGC");

var lastAPICallDate = new Date().getTime() - 1000;
const maxCallsPerMinute = 60;

async function makeApiCall(subject, data){
    //check if it has been at least 1 second since last call
    var secondsSinceLastCall = (new Date().getTime() - lastAPICallDate)/1000;
    if(secondsSinceLastCall < 1) return "Too many calls. You can only do " + (maxCallsPerMinute/60) + " requests per seconds";

    //if so, continue with API call request
    lastAPICallDate = new Date().getTime();
    switch(subject) {
        case "getCaseInformation":
            return await getCaseInfo(data[0], data[1]);
        default:
            return {};
    }
}

//get case info related to this case number chosen, and return the info as a JSON API file return
async function getCaseInfo(caseNumber, caseYear){
    //get info from giustizia civile API
    var apiCallResult = await giustiziaCivileAPI.getCase(caseNumber, caseYear);

    //convert information to conform to JSON structure and this own project protocol
    return dataParserGC.parseRawDataToJSON(apiCallResult);
}

module.exports = {
	makeApiCall
};



