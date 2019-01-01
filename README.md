# Giustizia Civile API

This project is a NodeJS API to access Italy's Guistizia Cilvile Sentences Info as REST HTTP (GET) requests or local method calling, receiving back responses in JSON format. The current release is v0.1b. The protocol we created for the sentence information is at version v0.1 as well.


## Getting Started

This API allows you to access Italy's civil court cases info for sentences related to Citizenship acquirance at Rome's Court.

To do so, you will need to accomplish 4 (four) separate steps:

1. Download this API project and:
    
    1.1 Install on your NodeJS project
    
    1.2 Start a GiustiziaCivileAPI own auto execute project 
    
2. Get your (a) unique User UUID, (b) unique User Token, (c) browse head metadata related to the unique User info, that conforms to the Guistizia Civile protocol

3. Configure the API with the unique User information acquired on the previous step

4. Start the API

5. Make requests of sentences realted to Civil Court Citizenship cases of Rome 


### Pre-requisites

To use this project, you will need to have installed:
* [nodeJS](https://nodejs.org/en/) - javascript's runtime for serverside Applications
* [mitmweb](https://mitmproxy.org) - mitmproxy Man-in-the-middle Visual Tool
* A real mobile device running [iOS](https://en.wikipedia.org/wiki/List_of_iOS_devices) or [Android](https://en.wikipedia.org/wiki/List_of_Android_smartphones) (virtual devices do not work)
* A [Wi-Fi router](https://en.wikipedia.org/wiki/Wireless_router) with visibility of devices for all the devices enabled, internet modem and deal device be connected into it and able to "see" each other on the network.
* The Giustizia Civile App properly downloaded installed on your real device
  * [iOS App - Giutizia Civile](https://itunes.apple.com/br/app/giustizia-civile/id598913361)
  * [Android App - Giustizia Civile](https://play.google.com/store/apps/details?id=it.giustizia.civile)

All instructions on how-to's for each requirement are located at their respective links.
Future releases of this API will increase the amount of Tutorial and How-to's to include them as well.


### Step 1 - Download this project

To download this project, just (1) click on the Clone/Download green button above, or, (2) click on this link below to get the latest release:

Latest release download link: [Giustizia Civile API v0.1b](https://github.com/lucasprates/GiustiziaCivileAPI/archive/master.zip)

Unzip the folder and:

1.1 add the main folder containing all downloaded files inside your NodeJS project (to use the method calling way and/or server method)

OR

1.2 uncomment the last line of the example above, located at api.JS file on line 38
```javascript
37 | //auto startup method calls
38 | startAPI();
```
and, using a shell/bash/terminal window, start the NodeJS project
```shell 
> GiustiziaCivileAPI: username$ node ./api.js
```

**You will notice that doing everything described above is not enough for this API to work. That is because Giustizia Civile's servers requires users to provide unique information for their servers reply with useful information. That is what the next step is here to help you with.**


### Step 2 - Getting unique user devices informations
To get the unique information required, you will need to have installed the [mitmweb](https://mitmproxy.org) on your preferred computer.

Instructions on how to do it are located at the link above.
Future versions of this tutorial will include more how-to's and detailed explanation on how to deploy the ```mitmweb / mitmproxy``` software suite.

This software is the required way to get your:
1. Unique User UUID
2. Unique User Token
3. Unique User Metadata headers
   * *device_name* - The device name registered by the App
   * *device_width* - The device width registered by the App
   * *device_height* - The device height registered by the App

These info above are required for the server to work properly (and so for this API as well).
The only way implemented so far for you to get those, is by running a Proxy at your computer with a Man-In-The-Middle scheme to get all the information necessary. That is why ```mitmweb / mitmproxy``` comes in hand.

After installing and running ```mitmweb```, leave the browser window open on your computer.

Now on your real mobile device, open the Proxy preferences on your mobile device ([iOS](https://www.amsys.co.uk/how-to-setup-proxy-servers-in-ios/) or [Android](https://adblockplus.org/android-config-samsung-galaxy-s3)) and add the IP Address of your computer running ```mitmweb``` (*e.g. 192.168.0.16*) and ```mitmweb```'s server bridge MitM port (*e.g. 8080*) in your real mobile device.

Close all applications on your real mobile device and open the giutizia civile app. You will see that a line of the open browser app ```mitmweb``` running on your computer will appear. Click on it and copy the information related to the request link parameters UUID, Token, and the headers metadata.

### Step 3 - Configure the API

On your GiustiziaCivileAPI deployed project, open the file located at relative path
```
./config/config.xml
```
and fill the information you gathered at **Step 2** accordingly (there is an example located at ```./config/config.xml.bak```).

### Step 3 - Use the API

There are two ways you can use the API:
1. Using the Server module (doing local REST GET calls)
2. Importing the API into one of your NodeJS project's files and calling the methods to configure and install it.


The first (1) method, using the Server Module, requires you to start this node server application and make a request for a case / sentence.
Step 1 explains hoe to start a server application and the next chapter explains how to make requests for information.

The second (2) method, importing and calling the API, requires you to, first, require the library as a variable inside your own nodeJS application.

The import is made by adding this line of code in your application:

```javascript
var giustiziaCivileAPI = require('./GiustiziaCivileAPI/code/api');
```

After that, you can use your newly created giustiziaCivileAPI object to start the API, using the following code:

```javascript
giustiziaCivileAPI.startAPI({ /*OPTION_VARIABLES_GOES_HERE*/ }); //the variables are in a dictionary structure
```
If you want to customize your API, you can use one of the available *options*' variables. Currently, we support the following two:
 * server_status ["ON" or "OFF"] - Status that indicates if you want to, or not, enable the server mode to gather information by making HTTP GET requests locally at the computer running the API.
 * unique_user_info ["ON" or "OFF"] - A variable that indicates if unique user information will be sent on the API calling method level. If so, you have to assign the following two variables as well:
    * *user_uuid* - The new unique user UUID
    * *user_token* - The new unique user token
    * *user_metadata* - A dictionary containing the new unique user metadata (*device_name*, *device_width*, *device_height*) 

A real example of an API start using method 2 with options enabled is shown below:

```javascript
giustiziaCivileAPI.startAPI({ server_status: "ON", unique_user_info: "ON", user_metadata: { device_name: "DEVICE_NAME_GOES_HERE", device_width: "DEVICE_WIDTH_GOES_HERE", device_height:"DEVICE_HEIGHT_GOES_HERE" } });
```
 
   Warning:
    * If you do not want to use a variable, there is not need to set it as "OFF".
    * This new info will replace the old one on config_server.xml for persistance and later use
    * user_metadata setup on local method is not yet completely implemented. Future versions will have it fully functional.
 
And make a request by using the following code:

```javascript
giustiziaCivileAPI.getCaseInfo("CASE_NUMBER_GOES_HERE", "YYYY"); //"CASE_NUMBER_GOES_HERE" has to be the 5-digit real case number and the "YYYY" should be the year number in the 4-digit format. All represented by String type.
```


The request will return a dictionary, and follow the same protocol specified in the second following chapter called: *The retrieved case / sentence information*.


## The request for case / sentence information

To request for a case / sentence information using the first method, you need to make a GET HTTP request to the local IP Address and Port number where the nod of this project is running.You do this by opening your favorite browser and accessing the local URL using the following URL protocol:

```
http://localhost:3001/api/case/CASE_NUMBER_GOES_HERE?year=YYYY
```
The case number should be the the 5-digit numeric

If you want to change the port number, just go to the file located at ./server/server.js, and, on line 39, change the number *3001* to the wished one. A sample of the code is located below.
```
    app.listen(process.env.PORT || 3001);
```
Don't forget to restart the server afterwards.


Also, to make a request for a case / sentence information using the second method, all you need to do is follow the previous step 3, method 2.


## The retrieved case / sentence information

The return sentence information will come as a JSON format or local memory dictionary, depending on how you use the API on step 3.
Each variable has a **value** and **description**, where value contains the content retrieved by the GuisitizaCivile's server and description contains the italian name/description of the variable.

The tree structure of the sentence info returned are as follow:

```javascript
mainMember (Attore Principale) - e.g. "A*** B******"
lawyerName (avvocato) - e.g. "Avv. A**** B******"
mainDefendant (Convenuto Principale) - e.g. "B****** P*********"

caseNumber (NumeroRuolo) - e.g. "99999"
caseYear (AnnoRuolo) - e.g. "2018"

registerType (Registro) - e.g. "CC"

officeName (descUfficio) - e.g. "Tribunale Ordinario di Roma"
officeID (IdUfficio) - e.g. "0580910098"

registerDate (iscritto_ruolo) - e.g. "23/06/2012" [DD/MM/YYYY]

subject (Oggetto) - e.g. "Diritti della cittadinanza"
section (Sezione) - e.g. "SEZIONE STRANIERI DIRITTI PERSONA"

currentJudgeName (NomeGiudice) - e.g. "Nome Cognome"
nextCourtHearingDate (DataUdienza) - e.g. "YYYY-MM-DD HH:mm"

currentStatus (Stato fascicolo) - e.g. "ATTESA ESITO UDIENZA DI COMPARIZIONE"

pastStatus (Storico fascicolo) e.g. [status0, status1]
    status0 e.g. {"date": "YYYY-MM-DD", "description":"SCRIZIONE RUOLO GENERALE"}
```

A real sample JSON file returned for sentence number 4200 of the year 2018 are as following, as well:
```json
{
   "mainMember": {
      "value": "B**** C****",
      "description": "attore_principale"
   },
   "lawyerName": {
      "value": "Avv. C****** A****",
      "description": "avvocato"
   },
   "mainDefendant": {
      "value": "M**** *****",
      "description": "convenuto_principale"
   },
   "caseNumber": {
      "value": "42000",
      "description": "numero_ruolo"
   },
   "caseYear": {
      "value": "2018",
      "description": "anno_ruolo"
   },
   "registerType": {
      "value": "CC",
      "description": "contenzioso_civile"
   },
   "officeName": {
      "value": "Tribunale Ordinario di Roma",
      "description": "desc_ufficio"
   },
   "officeID": {
      "value": "0580910098",
      "description": "id_ufficio"
   },
   "registerDate": {
      "value": "21/06/2018",
      "description": "iscritto_ruolo"
   },
   "subject": {
      "value": "Diritti della cittadinanza",
      "type": "citizenship",
      "description": "oggetto"
   },
   "currentJudgeName": {
      "value": "CIAVATTONE CRISTIANA",
      "description": "nome_giudice"
   },
   "section": {
      "value": "SEZIONE STRANIERI DIRITTI PERSONA",
      "description": "sezione"
   },
   "currentStatus": {
      "value": "21/06/2018 - ISCRIZIONE RUOLO GENERALE",
      "description": "stato_fascicolo"
   },
   "nextCourtHearingDate": {
      "value": "2019-11-22 11:00",
      "description": "data_udienza"
   },
   "pastStatus": {
      "value": [
         {
            "value": "21/06/2018 - ISCRIZIONE RUOLO GENERALE",
            "description": "storico_fascicolo_0",
            "date": "21/06/2018",
            "subject": "ISCRIZIONE RUOLO GENERALE"
         },
         {
            "value": "28/06/2018 - ASSEGNAZIONE A SEZIONE",
            "description": "storico_fascicolo_1",
            "date": "28/06/2018",
            "subject": "ASSEGNAZIONE A SEZIONE"
         },
         {
            "value": "19/09/2018 - DESIGNAZIONE GIUDICE",
            "description": "storico_fascicolo_2",
            "date": "19/09/2018",
            "subject": "DESIGNAZIONE GIUDICE"
         },
         {
            "value": "19/10/2018 - FISSAZIONE UDIENZA DI COMPARIZIONE PARTI",
            "description": "storico_fascicolo_3",
            "date": "19/10/2018",
            "subject": "FISSAZIONE UDIENZA DI COMPARIZIONE PARTI"
         }
      ],
      "description": "storico_fascicolo"
   }
}
```

More details will be added later regarding the returned info and JSON file structure.


## Built With and/or Using

* [parse5](https://github.com/inikulin/parse5) - HTML parsing/serialization toolset for Node.js. WHATWG HTML Living Standard (aka HTML5)-compliant.
* [HomeBrew](https://brew.sh) - The missing package manager for macOS
* [ExpressJS](http://expressjs.com) - Fast, unopinionated, minimalist web framework for Node.js
* [xml2json](https://www.npmjs.com/package/xml2json) - Simple XML2JSON Parser
* [request-promise](https://github.com/request/request-promise) - The simplified HTTP request client 'request' with Promise support.
* [giustizia-scrap](https://github.com/chessbr/giustizia-scrap) - Project that scans for Italian citizenship judicial processes in Giustizia Civile from Rome court.

## Contributing

If you want to contribute to this project, just contact one of the authors and hop right in.

## Versioning

We use Github and GIT for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Lucas Quintiliano Prates** - *Initial work* - [lucasprates](https://github.com/lucasprates)



## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
For details on how it works, click on the link above.

## Acknowledgments

* Thanks to [Christian Hess (a.k.a. chessBR)](https://github.com/chessbr) for creating the [giustizia-scrap](https://github.com/chessbr/giustizia-scrap) repo, base inspiration for this API to be done.


## Future improvements (TODOs)

* Better tutorials for all steps and pre-requisites involved
* Readme.MD file with instructions will also be avaliable in Portuguese and Italian
* Automated Test cases
* Insertion into NPM package manager
* Auto User ID, Token and Metadata generation
* Compatability with all civil cases in all offices (now it only work for citizenship cases in Rome, IT)

## Attention
***Do not overload Giustizia Civile servers to prevent blocking your UUID/token/IP and maybe also removing the API from the users. Do not use this code for maliscious purposes.***

---

I hope this project helps you all know more about the hard and bureaucratic proccess to acquire Italian citizenship using Rome's Civil Court case sentence(s).