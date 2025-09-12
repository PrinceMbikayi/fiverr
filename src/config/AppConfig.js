/* AppConfig.js */
/* AppConfig file contains const related to the App i.e. version */

export const VERSION = 0.1;
//const server = "//preprod.calypshome.com"
const server ="//calypshome.avidsen.one";

//const server = "//preprod.calypshome.com:9443"
//const server = "//preprod-profalux-v2.avidsen.one"


//const server = "//preprod.athemium.com"
//const server = "//airhome.app"
//const server = "//demo.athemium.com";
//const server ="//donkey.athemium.com";
//const server = "http://www.xyz-22.co.uk"; // pour test serveur hors service

//const server = "//192.168.1.42:7682";
const serverSecure = true;

export const WS_SERVER = ((serverSecure) ? "wss:":"ws:")+server;
export const SERVER_URL = ((serverSecure) ? "https:":"http:")+server;
export const IMG_PATH = SERVER_URL+"/theme/dark/img/domus_objects/";



export const APP_VERSION = "2.1.x.x";


export const GOOGLE_SENDER_ID = "681906456138"

export const HIDDEN_OBJECTS = [ 'Mobile','Notifications','Gateway','EnOcean','ZWave','Scheduler','SchedulerTask','Scenario',
                                'Show_application',
                                'Camera','audioMixer','multimediaVoice',
                                "NetAtmo",'NetatmoStation','NetatmoWindGauge',"NetatmoRainGauge","NetatmoOutdoorProbe"

                            
                            
                            ];
             /**
              *  @type {{ACCOUNT, PROGRAMMATION, HOME,SETTINGS,ABOUT,ADD_GROUP,GROUP,HomeGroup}} 
              * 
              */                   
export const appRoutesNames = { 
                                "ACCOUNT" : "Account",
                                "PROGRAMMATION" : "Programmation",
                                "HOME" : "Home",
                                "SETTINGS" : 'Settings',
                                "ABOUT" : 'About',
                                "ADD_PRODUCT":'AddProduct',
                                "ADD_GROUP" : "GroupHomeScreen",
                                "ROOMS" : 'Rooms',
                                "ROOM" : "Room",
                                "GROUP" : "Group",
                                "FAMILY_PRODUCTS":"FamilyProducts",
                                "LOGOUT_GATEWEY" : "LogoutGateway",
                                "FAMILY_HEATER_PRODUCTS" : "familyHeaterProducts",
                                "FAMILY_LIGHT_PRODUCTS" : "familyLightProducts",
                                "FAMILY_PLUG_PRODUCTS" : "familyPlugProducts",
                                "FAMILY_GATE_PRODUCTS" : "familyGateProducts",
                                "FAMILY_SHUTTER_PRODUCTS" : "familyShutterProducts",
                                "NOTIFICATIONS" : "Notifications",
                                GroupNavigation : {
                                    "HomeGroup" : "GroupHome",
                                    "SELECT" : "Bob"

                                }


}
export const OBJECT_TYPE_VARNAME = 'className';


/*
    tip : add __ at the begining of to hide it in webview

*/

export const COMMON_STRINGS = {
    schedulerTaskName : "{{hidden}}Task-{{taskType}}-{{taskName}}-{{objectId}}",
    schedulerTaskEventName : "event/scheduler/task/{{schedulerTaskName}}/",
}

// v1 : export const noLevel2Access = ["Weather","AtHomeWirePilot","FilPilote","AirConditioner","SolarPanel"];
export const noLevel2Access = ["Weather","WeatherSupport","AirConditioner","SolarPanel"];





//-------------------------------------
//import themeDomus from './theme.json';

import themeDomus from './iconSets';


export const iconSets = themeDomus.resource.pictures.iconSets;

//-------- Multi server Trick ---------

export const multiServers = [

                                {label:'prod',url:'https://calypshome.avidsen.one'},
                                {label:'preprod',url:'https://preprod.calypshome.com'},
                                {label:'dev',url:'https://profalux.avidsen.one'},

                                // {label:'demo',url:'https://demo.athemium.com'},
                                // {label:'test',url:'https://test.avidsen.one'},
                                // {label:'donkey',url:'https://donkey.athemium.com'},
                                // {label:'custom',url:'enter an address'}
                            ]

//--------- APPLICATIONS ---------------
export const applicationComponentsMap = {
    'athome_thermostat' : 'ApplicationThermostat'
}

