//setup_config.js
//This file is responsible for adding the user's token and UUID to the project via both method and API calling
'use strict';

var fs = require('fs');
var xmlParser = require('xml2json');

var user_uuid = "";
var user_token = "";
var user_deviceName = "";
var user_deviceWidth = "";
var user_deviceHeight = "";

//sets the user info into local file vars
async function setUserInfo(uuid, token, deviceName, deviceWidth, deviceHeight){
	if(uuid && (typeof uuid == "string")) user_uuid = uuid;
	if(token && (typeof token == "string")) user_token = token;
	if(deviceName && (typeof token == "string")) user_deviceName = deviceName;
	if(deviceWidth && (typeof token == "string")) user_deviceWidth = deviceWidth;
	if(deviceHeight && (typeof token == "string")) user_deviceHeight = deviceHeight;

	if(user_uuid && user_token && user_deviceName && user_deviceWidth && user_deviceHeight){
		//add this user info to the XML file
		return await saveUserInfoToXML();
	}
}

//try to get the user info from the persisted config XML file and send populate global vars (user_uuid, user_token)
async function retrieveUserInfoFromXML(){
	return new Promise(resolve => {
		fs.readFile('./config/config.xml', "utf8", function(err, data) {
			if(err) resolve(false);
			var jsonOfXML = JSON.parse(xmlParser.toJson(data));
	
			//now populate user info into local var
			user_uuid = jsonOfXML.user_info.uuid;
			user_token = jsonOfXML.user_info.token;

			user_deviceName = jsonOfXML.user_info.deviceName;
			user_deviceWidth = jsonOfXML.user_info.deviceWidth;
			user_deviceHeight = jsonOfXML.user_info.deviceHeight;
			
			resolve(true);
		 });
	  });
}

//add user info on global vars to the config XML file
async function saveUserInfoToXML(){
	return new Promise(resolve => {
		var xmlFromJSON = xmlParser.toXml("{ \"user_info\": { \"token\": \""+user_token +"\", \"uuid\": \""+user_uuid +"\",  \"deviceName\": \""+user_deviceName +"\",  \"deviceWidth\": \""+user_deviceWidth +"\",  \"deviceHeight\": \""+user_deviceHeight +"\" } }");
		fs.writeFile('./config/config.xml', xmlFromJSON, function(err, data){
			if (err) resolve(false);
			resolve(true);
		});
	});
}

//get the user info inserted by the user (returns a Array containing [User ID, User Token])
function getUserInfo(){
	var errorCode = 0;
	
	if(user_uuid && (typeof user_uuid == "string") == false) errorCode +=1;
	if(user_token && (typeof user_token == "string") == false) errorCode +=1;
	
	if(user_deviceName && (typeof user_deviceName == "string") == false) errorCode +=1;
	if(user_deviceWidth && (typeof user_deviceWidth == "string") == false) errorCode +=1;
	if(user_deviceHeight && (typeof user_deviceHeight == "string") == false) errorCode +=1;

	if(errorCode == 0){
		return [user_uuid, user_token, user_deviceName, user_deviceWidth, user_deviceHeight];
	}else{
		return errorCode;
	}
}

module.exports = {
	setUserInfo, getUserInfo, retrieveUserInfoFromXML
};