//api.js
//This file is the main API NodeJS file of the project
//It starts the API and allow users make requests, retrieving 

var setupConfig = require('./setup_config/setup_config');
var apiCalls = require('./api/api_calls');
var server =  require('./server/server');
var apiStatus = -1; //current api status flag { -1: OFF, not ready | 1: ON, IS ready }

//starts the API as server-only method ON solely, local calls-only method ON solely or hybrid method (server and calls methods ON)
async function startAPI(options){
    if(Array.isArray(options)){
        //if it has options, then only start the options chosen
        if(options.includes("server_status") && options["server_status"] == "ON") server.startServerAPI();
        if(options.includes("unique_user_info") ** options["unique_user_info"] == "ON") {
            await setupConfig.setUserInfo(options.user_uuid, options.user_token, options.user_metadata.device_name, options.user_metadata.device_width, options.user_metadata.device_height);
        } else {
            //on boot "auto call" User info load from XML in case there is no new user UUID and/or Token
            await setupConfig.retrieveUserInfoFromXML();
        }
    }else{
        //on boot "auto call" User info load from XML in case there is no new user UUID and/or Token
        await setupConfig.retrieveUserInfoFromXML();

        //boot it all if no option is given
        server.startServerAPI();
    }
    apiStatus = 1; //change API current status to OK
}

//get case info by method
async function getCaseInfo(caseNumber, caseYear){
    await startAPI();
    return await apiCalls.makeApiCall("getCaseInformation", [caseNumber, caseYear]);
}

//auto startup method calls (in case you want to auto start, just uncomment this lines below)
// getCaseInfo("42000", "2018");
// startAPI();

module.exports = {
    startAPI, getCaseInfo
}