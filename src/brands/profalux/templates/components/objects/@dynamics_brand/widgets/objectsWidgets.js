import {TempLightSensor as EzspProbe} from '_brand/templates/components/objects/sensor/widget/TempLightSensor';
import {SensorsWidget as NetatmoStation} from '_brand/templates/components/objects/netatmoSensors/widget/SensorsWidget';
import {SensorsWidget as NetatmoIndoorProbe} from '_brand/templates/components/objects/netatmoSensors/widget/SensorsWidget';
import {SensorsWidget as NetatmoOutdoorProbe} from '_brand/templates/components/objects/netatmoSensors/widget/SensorsWidget';
import {SensorsWidget as NetatmoRainGauge} from '_brand/templates/components/objects/netatmoSensors/widget/SensorsWidget';
import {SensorsWidget as NetatmoWindGauge} from '_brand/templates/components/objects/netatmoSensors/widget/SensorsWidget';


import {TypeWeather as WeatherSupport} from '_brand/templates/components/objects/weatherSupport/weather';
//import {TypeWeather as WeatherSupport} from '_components/objects/weather/weather';

// Harold Profalux addition
import {ShutterWidgetView as Rolling_Shutter_Ezsp}  from '_brand/templates/components/objects/shutters/rollingShutter/widget/ShutterWidgetView';
import {StoreWidgetView as Shade_Ezsp}  from '_brand/templates/components/objects/shutters/store/widget/StoreWidgetView';
import {Shutter868WidgetView as Rolling_Shutter_Profalux}  from '_brand/templates/components/objects/shutters/shutter868/widget/Shutter868WidgetView';
import Venetian_Shutter_Ezsp from '_brand/templates/components/objects/shutters/venetianShutter/widget/VenetianShutterWidgetView';

import {GarageWidget as  Garage_Door_Ezsp} from '_brand/templates/components/objects/garagedoor/widget/GarageWidget';
import {GarageWidget as  Garage_Door_Toggle_Ezsp} from '_brand/templates/components/objects/garagedoor/widget/GarageWidget';

import {GatesWidget as  Gate_Toggle_Ezsp} from '_brand/templates/components/objects/gates/widget/GatesWidget';
import {GatesWidget as  Gate_Ezsp} from '_brand/templates/components/objects/gates/widget/GatesWidget';

//import {Plug as AtHomePlugIn} from '_brand/templates/components/objects/plug/widget/Plug';
import {Plug as  SwitchEzsp} from '_brand/templates/components/objects/plug/widget/Plug';
//import {WhiteLight as  AtHomePlugIn} from '_brand/templates/components/objects/light/widget/WhiteLight';
import { LightsWidget as LightEzsp} from '_brand/templates/components/objects/light/widget/LightsWidget';
import { GroupWidgetView as composite} from '_brand/templates/components/objects/groupObject/widget/GroupWidgetView';

import {WidgetContent as Associations} from '_brand/templates/screens/routines/components/WidgetContent'
import {CommonAppWidget as application} from '_brand/templates/screens/routines/components/CommonAppWidget'
//import {EcoConfortWidgetContent as application} from '_brand/templates/screens/routines/components/EcoConfortWidgetContent'
//import {WindProtectionWidgetContent as application} from '_brand/templates/screens/routines/components/WindProtectionWidgetContent'
import {SesameGateWidget as  SesameGate} from '_brand/templates/components/objects/sesameGate/widget/SesameGateWidget';

export {
    
    Rolling_Shutter_Ezsp,
    Venetian_Shutter_Ezsp,
    Shade_Ezsp,
    Rolling_Shutter_Profalux,
    SwitchEzsp,
    LightEzsp,
    composite,
    WeatherSupport,
    EzspProbe,
    Garage_Door_Ezsp,
    Gate_Toggle_Ezsp,
    Garage_Door_Toggle_Ezsp,
    Gate_Ezsp,
    NetatmoStation,
    NetatmoIndoorProbe,
    NetatmoOutdoorProbe,
    NetatmoRainGauge,
    NetatmoWindGauge,
    Associations,
    application,
    SesameGate

}