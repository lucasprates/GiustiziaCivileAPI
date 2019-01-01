//giustiziaCivileAPI.js
//This file is the "real deal". It sends requests to Italy's Giustizia Civile's Server and gets its data

'use strict';

var userConfig = require("../setup_config/setup_config");
const requestHTTP = require("request-promise");

const requestPath = "https://mob.processotelematico.giustizia.it/proxy/index_mobile.php?"

var requestParameters = {
    "version": "1.1.13",
    "platform": "iOS 12.1",
    "uuid": "USER_UNIQUE_DEVICE_UUID_GOES_HERE",
    "devicename": "USER_UNIQUE_DEVICE_NAME_GOES_HERE",
    "devicewidth": "USER_UNIQUE_DEVICE_WIDTH_GOES_HERE",
    "deviceheight": "USER_UNIQUE_DEVICE_HEIGHT_GOES_HERE",
    "token": "USER_UNIQUE_DEVICE_TOKEN_GOES_HERE",
    "azione": "direttarg_sicid_mobile",
    "registro": "CC",
    "idufficio": "0580910098",
    "numproc": "ID_OF_PROCCESS (CASE_NUMBER)",
    "aaproc": "YEAR",
    "tipoufficio": "1",
    "_": "CURRENT_TIME_IN_MS_GOES_HERE"
};

//get case info from Italy's Giustizia Civile's Server
async function getCase(caseNumber, caseYear){
    let userInfo = userConfig.getUserInfo();
    if(!(userInfo && Array.isArray(userInfo) && userInfo.length == 5)) return {};
    var userUUID = userInfo[0];
    var userToken = userInfo[1]; 

    var userDeviceName = userInfo[2];
    var userDeviceWidth = userInfo[3];
    var userDeviceHeight = userInfo[4];

    //populate user related parameters
    requestParameters.uuid = userUUID
    requestParameters.token = userToken

    requestParameters.devicename = userDeviceName;
    requestParameters.devicewidth = userDeviceWidth;
    requestParameters.deviceheight = userDeviceHeight;    

    requestParameters.numproc = caseNumber
    requestParameters.aaproc = caseYear
    requestParameters._ = new Date().getTime()

    //prepare parameters to send
    var fullURL = requestPath + Object.entries(requestParameters).map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
    const options = {
        url: fullURL,
        method: 'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/16B92 (4407242800)',
            'Host': 'mob.processotelematico.giustizia.it',
            'path': '/',
            'Accept': '*/*',
            'Accept-Language': 'en-US',
            'Connection': 'keep-alive',
            'Accept-Encoding':	'gzip, deflate',
            'X-Requested-With': 'it.giustizia.civile'
        }
    };

    //make request (get)
    var result = await requestHTTP(options);

    //check if it returned any error signs
    if(checkForErrors(result) == false) return null;
    
    return result;
}

//check if response contains any signs of errors found
function checkForErrors(response){
    if(response.includes("<Errore>") && response.includes("</Errore>")){
        return false; //found error
    }
    return true;
}

module.exports = {
    getCase
};