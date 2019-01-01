//server.js
//This file is the local server part of the API, in case someone wants to request it this way at their machine
//This is a NodeJS server and the port where this will be 

var apiCalls = require('../api/api_calls');

const express = require('express');
const app = express();

function startServerAPI(){
    //main page, with documentation
    app.get('/', function (req, res) {
        return res.send('Giustizia Civile\'s Server sentence information Main Page<br><br> To access the API, go to path: http://localhost:3001/api/');
    });

    //main api page
    app.get('/api', function (req, res) {
        return res.send('Giustizia Civile API v0.1b<br><br> API Section<br>To access a sentence, go to path: http://localhost:3001/api/case');
    });

    //main case section of API
    app.get('/api/case', function (req, res) {
        return res.send('Giustizia Civile API v0.1b<br><br> Case Section<br>Type on the URL a case number and the year you want yo request information following the format:<br>http://localhost:3001/api/case/CASENUMBER?year=YYYY');
    });

    //main case number info section of API
    app.get('/api/case/*', async function (req, res) {
        //get api parameter (case number)
        var caseNumber = req.params[0];
        var caseYear = req.query.year;
        if(!isNaN(caseNumber) && !isNaN(caseYear) && caseYear.length == 4){
            var caseInfoJSON = await apiCalls.makeApiCall("getCaseInformation", [caseNumber, caseYear]);
            return res.send(JSON.stringify(caseInfoJSON));
        }else{
            return res.send('Giustizia Civile API v0.1b\n\nCase Retrieve Section - Wrong case number or year format. Please, use the following format:<br>http://localhost:3001/api/case/CASENUMBER?year=YYYY');
        }
    });
    
    app.listen(process.env.PORT || 3001);
}

 module.exports = {
    startServerAPI
}