
import React from 'react';

import Default from '../templates/components/objects/qrBasic/wizard/wizardNavigation';
import {ShutterLevel1Settings}  from '_brand/templates/components/objects/shutters/rollingShutter/settings/ShutterLevel1Settings';
import {VenetianShutterSettings} from '_brand/templates/components/objects/shutters/venetianShutter/settings/VenetianShutterSettings';
import {PlugSettings} from '_brand/templates/components/objects/plug/settings/PlugSettings';
import { LightSettings } from '_brand/templates/components/objects/light/settings/LightSettings'
import {Shutter868Settings}  from '_brand/templates/components/objects/shutters/shutter868/settings/Shutter868Settings';
import {StoreSettings}  from '_brand/templates/components/objects/shutters/store/settings/StoreSettings';
import {GarageSettings}  from '_brand/templates/components/objects/garagedoor/settings/GarageSettings';
import {GatesSettings}  from '_brand/templates/components/objects/gates/settings/GatesSettings';
import {SesameGateSettings}  from '_brand/templates/components/objects/sesameGate/settings/SesameGateSettings';
import {TempLightSensorSettings} from '_brand/templates/components/objects/sensor/settings/TempLightSensorSettings';
import {SensorsSettings} from '_brand/templates/components/objects/netatmoSensors/settings/SensorsSettings';
import {SesameSettingsStack} from '_brand/templates/components/objects/sesame/settings/SesameSettingsStack';


const Destinations = {  'default' : Default,
                        'Rolling_Shutter_Ezsp': ShutterLevel1Settings, 
                        'Venetian_Shutter_Ezsp': VenetianShutterSettings,
                        'SwitchEzsp': PlugSettings,
                        'LightEzsp': LightSettings,
                        'Rolling_Shutter_Profalux': Shutter868Settings,
                        'Shade_Ezsp':StoreSettings,
                        'Garage_Door_Ezsp':GarageSettings,
                        'Garage_Door_Toggle_Ezsp':GarageSettings,
                        'Gate_Toggle_Ezsp':GatesSettings,
                        'Gate_Ezsp':GatesSettings,
                        'SesameGate': SesameGateSettings,
                        'EzspProbe' : TempLightSensorSettings,
                        "NetatmoStation":SensorsSettings,
                        "NetatmoIndoorProbe":SensorsSettings,
                        "NetatmoOutdoorProbe":SensorsSettings,
                        "NetatmoRainGauge":SensorsSettings,
                        "NetatmoWindGauge":SensorsSettings,
                        "SesameGate":SesameSettingsStack

                    };

export const getSettingsComponent = (props) => {
   
    const params = props?.route?.params || {} 
    console.log("getSettingsComponent params AAAAA :", params);
    const {typeName} = params;   
    const MyDestination = Destinations[typeName]; 
    if(MyDestination) return <MyDestination/>;
    return <Destinations.default />   
}