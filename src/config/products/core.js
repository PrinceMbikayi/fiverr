
import {find as _find, findKey as _findKey} from 'lodash';
//-------------------------------------------------------------
import athomeProductsDatas from './athomeProducts.json';


import brandProductsDatas from '_brand/config/products/products.json'

const productDatas = {...athomeProductsDatas,...brandProductsDatas}

//console.log("productDatas",productDatas)

export const athomeProducts = Object.keys(productDatas);
export const notInGroupProducts = ["DOORKEEPER","PROBE-TEMP"];

export const athomeGroupTypes = require('./athomeGroupTypes.json');
export const athomeFamilyTypes = require('./athomeFamilyTypes.json');



//import {brandProductsPairingInfos } from '_brand/config/products/brandProducts'

/**
 * 
 * if product has variant, you need to add the subtype to the key in order to have unique keys
 * And you must add the property productName to the object value
 * (see ACCESS)
 * 
 * if the product has no variant the key in the equal to the productName, no need to add the productName in the object value
 * 
 * 
 */
import {brandProductsPairingInfos } from '_brand/config/products/brandProducts';
export const objectPairingInfos = brandProductsPairingInfos;
/*
export const objectPairingInfos = {
                                    "CALI-O" : {'typeName':"AtHomeHeater",'type':"heater",'subtype':"on_off",'subtypeNumber':0},
                                    "CALI-P" : {'typeName':"AtHomeWirePilot",'type':"heater",'subtype':"wire_pilot",'subtypeNumber':1},
                                    "CALI-B" : {'typeName':"AtHomeBoilert",'type':"heater",'subtype':"boiler",'subtypeNumber':2},
                                    "DIANE-LED": {'typeName':"AtHomeLight",'type':"light",'subtype':"light_rgb",'subtypeNumber':8},
                                    "DIANE-2":  {'typeName':"AtHome2ChLight",'type':"light",'subtype':"2ch",'subtypeNumber':6},
                                    "PLUG-I" : {'typeName':"AtHomePlugIn",'type':"switch",'subtype':"on_off_in",'subtypeNumber':3},
                                    "PLUG-O" : {'typeName':"AtHomePlugOut",'type':"switch",'subtype':"on_off_out",'subtypeNumber':4},
                                    "ACCESS-MICRS" : {'productName':'ACCESS','typeName':"AtHomeModuleShutter",'type':"shutter",'subtype':"micrs",'subtypeNumber':7},
                                    "ACCESS-MICRS2" : {'productName':'ACCESS','typeName':"AtHomeModuleShutter",'type':"shutter",'subtype':"micrs2",'subtypeNumber':11},
                                    "GUARDIAN" : {'typeName':"AtHomeModuleGate",'type':"gate",'subtype':"mic2ch",'subtypeNumber':5},
                                    "PROBE-TEMP" : {'typeName':"AtHomeProbe",'type':'sensor','subtype':"temp_sensor",'subtypeNumber':9},
                                    "VDP": {'typeName':"AtHomeVDP",'type':'access','subtype':"vdp",'subtypeNumber':10},
                                    "QR-BASIC" : {'typeName':"VDoorBell",'type':'access','subtype':"qr_basic",'subtypeNumber':20},
                                    "GATE-SLIDE" :  {'productName':'GATE','typeName':"BoardGate",'type':"gate",'subtype':"sliding",'subtypeNumber':30},
                                    "GATE-SWING" :  {'productName':'GATE','typeName':"BoardGate",'type':"gate",'subtype':"swing",'subtypeNumber':31},
                                    ...brandProductsPairingInfos
 
}
*/
/*
const extrasProductByCommercialName = {
                                        'THERMOSTAT':{'typeName':'AtHomeThermostat'},
                                        'WEATHER':{'typeName':'WeatherSupport'},
                                        'ACCESS':{'typeName':'AtHomeModuleShutter'},
                                        'GATE' : {'typeName':"BoardGate"},
                                        'GATE-TO-CONNECT' : {'typeName':"BoardGateToConnect"}
                                       
                                    
                                    }
                                    */

import {extrasProductByCommercialName} from '_brand/config/products/productByCommercialName';

export const productByCommercialName = {...extrasProductByCommercialName,...objectPairingInfos}

//console.log('productByCommercialName',productByCommercialName)


export const getProductExtras = (typeName) => {
    //console.log("hep hep hep")
    const commercialName = _findKey(productByCommercialName,{'typeName':typeName}) || typeName;

    return productDatas[commercialName]
}


import heatersConfig from './heaters.json';

export const atHomeHeaterMode = heatersConfig.atHomeHeaterMode;
/*
export const atHomeHeaterMode  = {
    "eco"       : {'icon': "AtHomeWirePilotEco", 'label' : "scenarios:HEATER_MODE_ECO"},
    "comfort" : {'icon':"AtHomeWirePilotComfort", 'label':"scenarios:HEATER_MODE_COMFORT"},
    "comfort-1" : {'icon':"AtHomeWirePilotComfort", 'label':"scenarios:HEATER_MODE_COMFORT_1"},
    "comfort-2" : {'icon':"AtHomeWirePilotComfort", 'label':"scenarios:HEATER_MODE_COMFORT_2"}
}
*/

export const heaterBasePrograms = heatersConfig.heaterBasePrograms;
/*
export const heaterBasePrograms  = {
    "eco"       : {'icon': "AtHomeWirePilotEco", 'label' : "scenarios:HEATER_MODE_ECO",'mode':"eco"},
    "comfort" : {'icon':"AtHomeWirePilotComfort", 'label':"scenarios:HEATER_MODE_COMFORT",'mode':"comfort"},
    "comfort-1" : {'icon':"AtHomeWirePilotComfort", 'label':"scenarios:HEATER_MODE_COMFORT_1",'mode':"comfort-1"},
    "comfort-2" : {'icon':"AtHomeWirePilotComfort", 'label':"scenarios:HEATER_MODE_COMFORT_2",'mode':"comfort-2"},
    "on" : {'icon':"AtHomeWirePilotComfort", 'label':"scenarios:HEATER_MODE_ON",'mode':"on"},
    "off" : {'icon':"AtHomeWirePilotEco", 'label':"scenarios:HEATER_MODE_OFF",'mode':"off"},
    "frost_free" : {'icon':"AtHomeWirePilotFrostFree", 'label':"scenarios:THERMOSTAT_MODE_FROSTFREE",'mode':"frost_free"},   
    "frost-free" : {'icon':"AtHomeWirePilotFrostFree", 'label':"scenarios:THERMOSTAT_MODE_FROSTFREE",'mode':"frost-free"}, 
    "absence" : {'icon':"AtHomeThermostatAbsence", 'label':"scenarios:THERMOSTAT_MODE_ABSENCE",'mode':"absence"},
    "boost" : {'icon':"AtHomeThermostatBoost", 'label':"scenarios:THERMOSTAT_MODE_BOOST",'mode':"boost"}
}
*/
//************** HEATER SCHEDULES *********************/
const copyDay = (ranges) => {
    return  ranges.map(i => ({ ...i}))
}
// ------ wire pilot default schedule ---------------

const wp_normalDay = heatersConfig.wirepilot_normalDay;
const wp_weekendDay = heatersConfig.wirepilot_wp_weekendDay
/*
const wp_normalDay = [   
    {start:'00:00',end:'06:00',mode:'eco'},
    {start:'06:00',end:'09:00',mode:'comfort-1'},
    {start:'09:00',end:'12:00',mode:'eco'},
    {start:'12:00',end:'17:00',mode:'comfort-2'},      
    {start:'17:00',end:'22:00',mode:'comfort-1'},
    {start:'22:00',end:'24:00',mode:'eco'}
]
const wp_weekendDay = [
    {start:'00:00',end:'07:00',mode:'eco'},
    {start:'07:00',end:'12:00',mode:'comfort-1'},  
    {start:'12:00',end:'17:00',mode:'comfort'},      
    {start:'17:00',end:'22:00',mode:'comfort-2'},
    {start:'22:00',end:'24:00',mode:'eco'} 
]
*/

export const wirePilotDefaultScheduledatas =  [
                    copyDay(wp_normalDay),copyDay(wp_normalDay),copyDay(wp_normalDay), copyDay(wp_normalDay),copyDay(wp_normalDay),
                    copyDay(wp_weekendDay),copyDay(wp_weekendDay)
                ];

//--------------- BOILER --------------------------

const boilerDay = heatersConfig.boilerDay;
/*
const boilerDay =  [
            {start:'00:00',end:'06:00',mode:'on'},
            {start:'06:00',end:'22:00',mode:'off'},
            {start:'22:00',end:'24:00',mode:'on'}
        ]
*/
export const boilerDefaultScheduledatas =  [ 
                    copyDay(boilerDay), copyDay(boilerDay), copyDay(boilerDay), copyDay(boilerDay), copyDay(boilerDay),
                    copyDay(boilerDay), copyDay(boilerDay)
                ];
//-------------- HEATER ON / OFF ------------------

const h_normalDay = heatersConfig.heaterOnOff_normalDay
const h_weekendDay = heatersConfig.heaterOnOff_weekendDay

/*
const h_normalDay = [   
    {start:'00:00',end:'06:00',mode:'off'},
    {start:'06:00',end:'09:00',mode:'on'},
    {start:'09:00',end:'12:00',mode:'off'},
    {start:'12:00',end:'14:00',mode:'on'},
    {start:'14:00',end:'17:00',mode:'off'},      
    {start:'17:00',end:'22:00',mode:'on'},
    {start:'22:00',end:'24:00',mode:'off'},   
]
const h_weekendDay = [
    {start:'00:00',end:'08:00',mode:'off'},
    {start:'08:00',end:'22:00',mode:'on'},
    {start:'22:00',end:'24:00',mode:'off'},
]

*/
export const heaterDefaultScheduledatas =  [ 
    copyDay(h_normalDay), copyDay(h_normalDay), copyDay(h_normalDay), copyDay(h_normalDay), copyDay(h_normalDay),
    copyDay(h_weekendDay), copyDay(h_weekendDay)
];


export const heaterFamilyPrograms = {

    AtHomeHeater : {  programs: {
                            "on":heaterBasePrograms["on"],
                            "off":heaterBasePrograms["off"]
                        },
                default:"off",
                defaultSchedule:heaterDefaultScheduledatas
            },
    AtHomeBoiler : {  programs: {
                    "on":heaterBasePrograms["on"],
                    "off":heaterBasePrograms["off"]
                },
                default:"off",
                defaultSchedule:boilerDefaultScheduledatas
            },
    AtHomeWirePilot : {  programs: {
                    "eco":heaterBasePrograms["eco"],
                    "comfort":heaterBasePrograms["comfort"],
                    "comfort-1":heaterBasePrograms["comfort-1"],
                    "comfort-2":heaterBasePrograms["comfort-2"],
                    "frost-free":heaterBasePrograms["frost-free"],
                    "off":heaterBasePrograms["off"],

                },
                default:"eco",
                defaultSchedule:wirePilotDefaultScheduledatas
            },
     athome_thermostat : {  programs: {
        "off":heaterBasePrograms["off"],
        "frost_free":heaterBasePrograms["frost_free"],
        "absence":heaterBasePrograms["absence"],
        "eco":heaterBasePrograms["eco"],
        "comfort":heaterBasePrograms["comfort"],
        "boost":heaterBasePrograms["boost"],
    },
    default:"off",
    defaultSchedule:wirePilotDefaultScheduledatas
}
}
export const getModeLabel = (objectType,mode) => {
    
    const unknown = 'unknown';
    if(heaterFamilyPrograms[objectType].programs == undefined) return unknown;
    if(heaterFamilyPrograms[objectType].programs[mode] == undefined) return unknown;
    return heaterFamilyPrograms[objectType].programs[mode].label
}

export const getModeIcon = (objectType,mode) => {
    
    const unknown = 'unknown';
    if(heaterFamilyPrograms[objectType].programs == undefined) return 'empty.svg';
    if(heaterFamilyPrograms[objectType].programs[mode] == undefined) return 'empty.svg';
    return heaterFamilyPrograms[objectType].programs[mode].icon+'.svg'
}

//-------- DISGUISE -------------------

export const disguiseEnabled = {
    'AtHomePlugIn' : ['AtHomeHeater','AtHomeLight']
}