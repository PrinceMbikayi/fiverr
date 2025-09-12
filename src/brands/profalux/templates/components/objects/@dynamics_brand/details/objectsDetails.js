import {WeatherDetails as WeatherSupport} from "_brand/templates/components/objects/weatherSupport/WeatherDetails";
import {TempLightSensorDetail as EzspProbe} from '_brand/templates/components/objects/sensor/details/TempLightSensorDetail';
import {SensorsDetails as NetatmoStation} from '_brand/templates/components/objects/netatmoSensors/details/SensorsDetails';
import {SensorsDetails as NetatmoIndoorProbe} from '_brand/templates/components/objects/netatmoSensors/details/SensorsDetails';
import {SensorsDetails as NetatmoOutdoorProbe} from '_brand/templates/components/objects/netatmoSensors/details/SensorsDetails';
import {SensorsDetails as NetatmoRainGauge} from '_brand/templates/components/objects/netatmoSensors/details/SensorsDetails';
import {SensorsDetails as NetatmoWindGauge} from '_brand/templates/components/objects/netatmoSensors/details/SensorsDetails';


import {ShutterLevel2Details as Rolling_Shutter_Ezsp}  from '_brand/templates/components/objects/shutters/rollingShutter/details/ShutterLevel2Details';
import Venetian_Shutter_Ezsp from '_brand/templates/components/objects/shutters/venetianShutter/details/VenetianShutterLevel2Details';
import {StoreLevel2Details as Shade_Ezsp}  from '_brand/templates/components/objects/shutters/store/details/StoreLevel2Details';
import {Shutter868Level2Details as Rolling_Shutter_Profalux}  from '_brand/templates/components/objects/shutters/shutter868/details/Shutter868Level2Details';

import {PlugLevel2Details as  SwitchEzsp} from '_brand/templates/components/objects/plug/details/PlugLevel2Details';
import { LightLevel2Details as LightEzsp} from '_brand/templates/components/objects/light/details/LightLevel2Details';


import { GroupDetailView as composite} from '_brand/templates/components/objects/groupObject/details/GroupDetailView';
//import { GroupShuttersRoutineDetailView as composite } from '_brand/templates/components/objects/groupObject/routine/GroupShuttersRoutineDetailView';

import {GarageDetail as  Garage_Door_Ezsp} from '_brand/templates/components/objects/garagedoor/details/GarageDetail';
import {GarageDetail as  Garage_Door_Toggle_Ezsp} from '_brand/templates/components/objects/garagedoor/details/GarageDetail';
import {GatesDetail as  Gate_Toggle_Ezsp} from '_brand/templates/components/objects/gates/details/GatesDetail';
import {GatesDetail as  Gate_Ezsp} from '_brand/templates/components/objects/gates/details/GatesDetail';
import {SesameGateDetail as  SesameGate} from '_brand/templates/components/objects/sesameGate/details/SesameGateDetail';

export {
    WeatherSupport,
    Rolling_Shutter_Ezsp, 
    Venetian_Shutter_Ezsp, 
    Rolling_Shutter_Profalux, 
    Shade_Ezsp,
    LightEzsp,
    SwitchEzsp,
    composite,
    Garage_Door_Ezsp,
    Gate_Toggle_Ezsp,
    Garage_Door_Toggle_Ezsp,
    Gate_Ezsp,
    EzspProbe,
    NetatmoStation,
    NetatmoIndoorProbe,
    NetatmoOutdoorProbe,
    NetatmoRainGauge,
    NetatmoWindGauge,
    SesameGate

    
}