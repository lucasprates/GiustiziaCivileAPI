//dataParserGC.js
//This file contains the parser of the raw data received by the giustiziaCivileAPI part converted to the API created by this App (in JSON format)

'use strict';

const parse5 = require('parse5');
var caseInfo = {};

//function that parses the raw data received from the return call of giustiziaCivileAPI.js and prepares it to return a JSON file
function parseRawDataToJSON(rawData){
    caseInfo = {};
    const document = parse5.parse(rawData);
    findNode(["#text", "numeroruolo", "annoruolo", "registro", "descufficio", "idufficio","nomegiudice", "dataudienza"],document);
    return caseInfo;
}

//convert raw case data info received from giustiziaCivileAPI's getCase call return to this API's correct return protocol
var previousNodeText = "";
function findNode(id, currentNode) {
    for(var index in currentNode.childNodes){
        var node = currentNode.childNodes[index];
        //clean node value
        var cleanedNodeValue = cleanNodeValue(node.value);
        if(id.includes(node.nodeName) || id.includes(node.tagName)){
            if(node.nodeName != "#text"){ 
                fillDictInformation(previousNodeText, node.nodeName);
                previousNodeText = node.nodeName;
            }
            else if(cleanedNodeValue != "" && cleanedNodeValue != "/"){
                fillDictInformation(previousNodeText, cleanedNodeValue);
                previousNodeText = cleanedNodeValue;
            }
        }
        findNode(id, node);
    }
}

//fill temp dictionary containing case info retreived from Giustizia Civile as local dictionary memory structure
function fillDictInformation(pastNodeText, currentNodeText){
    //detect which condition it has to pass thru now 
    var conditionToFill = detectCondition(pastNodeText);

    //treat each switch case state to fill local dictionary with API info into pattern
    switch(conditionToFill) {
        case "Parti fascicolo":
            caseInfo["mainMember"] = { };
            caseInfo["mainMember"]["value"] = currentNodeText;
            caseInfo["mainMember"]["description"] = "attore_principale";
            break;

        case "**lawyerName**":
            caseInfo["lawyerName"] = { };
            caseInfo["lawyerName"]["value"] = currentNodeText;
            caseInfo["lawyerName"]["description"] = "avvocato";
            break;
        
        case "**mainDefendant**":
            caseInfo["mainDefendant"] = { };
            caseInfo["mainDefendant"]["value"] = currentNodeText;
            caseInfo["mainDefendant"]["description"] = "convenuto_principale";
            break;

        case "numeroruolo":
            caseInfo["caseNumber"] = { };
            caseInfo["caseNumber"]["value"] = currentNodeText;
            caseInfo["caseNumber"]["description"] = "numero_ruolo";
            break;

        case "annoruolo":
            caseInfo["caseYear"] = { };
            caseInfo["caseYear"]["value"] = currentNodeText;
            caseInfo["caseYear"]["description"] = "anno_ruolo";
            break;

        case "registro":
            caseInfo["registerType"] = { };
            caseInfo["registerType"]["value"] = currentNodeText;
            if(currentNodeText == "CC") caseInfo["registerType"]["description"] = "contenzioso_civile";
            break;

        case "descufficio":
            caseInfo["officeName"] = { };
            caseInfo["officeName"]["value"] = currentNodeText;
            caseInfo["officeName"]["description"] = "desc_ufficio";
            break;

        case "idufficio":
            caseInfo["officeID"] = { };
            caseInfo["officeID"]["value"] = currentNodeText;
            caseInfo["officeID"]["description"] = "id_ufficio";
            break;

        case "**registerDate**":
            caseInfo["registerDate"] = { };
            caseInfo["registerDate"]["value"] = pastNodeText.substring(pastNodeText.length-10, pastNodeText.length); //last chars only (DD/MM/YYYY)
            caseInfo["registerDate"]["description"] = "iscritto_ruolo";
            break;

        case "**subject**":
            caseInfo["subject"] = { };
            caseInfo["subject"]["value"] = currentNodeText;
            caseInfo["subject"]["type"] = "citizenship";
            caseInfo["subject"]["description"] = "oggetto";
            break;

        case "nomegiudice":
            caseInfo["currentJudgeName"] = { };
            caseInfo["currentJudgeName"]["value"] = currentNodeText;
            caseInfo["currentJudgeName"]["description"] = "nome_giudice";
            break;

        case "**section**":
            caseInfo["section"] = { };
            caseInfo["section"]["value"] = pastNodeText.substring(9);
            caseInfo["section"]["description"] = "sezione";
            break;

        case "Stato fascicolo":
            caseInfo["currentStatus"] = { };
            caseInfo["currentStatus"]["value"] = currentNodeText;
            caseInfo["currentStatus"]["description"] = "stato_fascicolo";
            break;

        case "dataudienza":
            caseInfo["nextCourtHearingDate"] = { };
            caseInfo["nextCourtHearingDate"]["value"] = currentNodeText;
            caseInfo["nextCourtHearingDate"]["description"] = "data_udienza";
            break;

        case "Storico fascicolo":
            caseInfo["currentStatus"] = { };
            caseInfo["currentStatus"]["value"] = currentNodeText;
            caseInfo["currentStatus"]["description"] = "stato_fascicolo";
            break;
        
        case "**pastStatusUnit**": //* if starts with format "##/##/#### *"
            if(!caseInfo.pastStatus) { caseInfo["pastStatus"] = { }; caseInfo["pastStatus"]["value"] = []; caseInfo["pastStatus"]["description"] = "storico_fascicolo"; }
            var newPastStatus = { "value": pastNodeText };
            newPastStatus["description"] = "storico_fascicolo_"+caseInfo["pastStatus"]["value"].length;
            newPastStatus["date"] = pastNodeText.substring(0, 10); //TODO
            newPastStatus["subject"] = pastNodeText.substring(13); //TODO
            caseInfo["pastStatus"]["value"].push(newPastStatus);
            break;

        default:
      }
}

function detectCondition(predicate){
    if(predicate.includes("Attore Principale")){
        return "**lawyerName**";
    }
    else if(predicate.includes("Avv. ")){
        return "**mainDefendant**";
    }
    else if(predicate.includes("iscritto al ruolo il ")){
        return "**registerDate**";
    }
    else if(predicate.includes("SOMMARIO DI COGNIZIONE")){
        return "**subject**";
    }
    else if(predicate.includes("Sezione:")){
        return "**section**";
    }
    //check if string starts with a date in a specific format
    else if(!isNaN(predicate.substring(0, 2))        //is DD as type number?
        && !isNaN(predicate.substring(3, 5))         //is MM as type number?
        && !isNaN(predicate.substring(6, 10))         //is YYYY as type number?
        && predicate.substring(2, 3) == "/"          //is DD and MM separeted by '/' character?
        && predicate.substring(5, 6) == "/"          //is MM and YYYY separeted by '/' character?
        && predicate.substring(10, 13) == " - ") {   //is the date and subject separeted by ' - ' characters?
            //if all passed, it starts with format '##/##/#### - '
            return "**pastStatusUnit**";
    }
    return predicate;
}

//function that cleans the text, taking away unnecessary carrier returns, etc
function cleanNodeValue(text){
    if(typeof text == "string") return text.replaceAll('\n','');
    return text;
}

module.exports = {
    parseRawDataToJSON
};

String.prototype.replaceAll = function(searchStr, replaceStr) {
    var str = this;
    
    // escape regexp special characters in search string
    searchStr = searchStr.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    
    return str.replace(new RegExp(searchStr, 'gi'), replaceStr);
};

// *** ---- ***
//JSON API case return structure (all returns are of String type) v0.1:

//mainMember (Attore Principale) - e.g. "A*** B******"
//lawyerName (avvocato) - e.g. "Avv. A**** B******"
//mainDefendant (Convenuto Principale) - e.g. "B****** P*********"

//caseNumber (NumeroRuolo) - e.g. "99999"
//caseYear (AnnoRuolo) - e.g. "2018"

//registerType (Registro) - e.g. "CC"

//officeName (descUfficio) - e.g. "Tribunale Ordinario di Roma"
//officeID (IdUfficio) - e.g. "0580910098"

//registerDate (iscritto_ruolo) - e.g. "23/06/2012" [DD/MM/YYYY]

//subject (Oggetto) - e.g. "Diritti della cittadinanza"
//section (Sezione) - e.g. "SEZIONE STRANIERI DIRITTI PERSONA"

//currentJudgeName (NomeGiudice) - e.g. "Nome Cognome"
//nextCourtHearingDate (DataUdienza) - e.g. "YYYY-MM-DD HH:mm"

//currentStatus (Stato fascicolo) - e.g. "ATTESA ESITO UDIENZA DI COMPARIZIONE"

//pastStatus (Storico fascicolo) e.g. [status0, status1]
    //status0 e.g. {"date": "YYYY-MM-DD", "description":"SCRIZIONE RUOLO GENERALE"}