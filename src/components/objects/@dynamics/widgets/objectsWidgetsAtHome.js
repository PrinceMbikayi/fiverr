/************************************************ 
 * 
 *  see in babel.config.js resolving modules
 * 
 * ...
 *          "_brand/templates/components/objects":['./src/brands/'+babel_json.brand+'/templates/components/objects','./src/components/objects'],
 *          "_brand":'./src/brands/'+babel_json.brand,
 *  ...
 * 
 ************************************************/


import {Type2ChLight as AtHome2ChLight} from '_components/objects/2ChLight/2ChLight';
import {TypeLight as AtHomeLight} from '_components/objects/light/light';
//import {TypeHeater as AtHomeLight} from '_components/objects/light/light';
import {TypePlug as AtHomePlugOut} from '_components/objects/plug/plug';
import {TypePlug as AtHomePlugIn} from '_components/objects/plug/plug';
import {TypeShutter as AtHomeModuleShutter} from '_components/objects/shutter/shutter';
import {TypeGuardian as AtHomeModuleGate} from '_components/objects/guardian/guardian';
import {TypeHeater as AtHomeHeater} from '_components/objects/heater/heater';
import {TypeHeater as AtHomeBoiler} from '_components/objects/heater/heater';
import {TypeWirePilot as AtHomeWirePilot} from '_components/objects/wirePilot/wirePilot';
import {TypeWeather as WeatherSupport} from '_components/objects/weather/weather';

import {TypeAtHomeProbe as AtHomeProbe} from '_components/objects/atHomeProbe/atHomeProbe';
import {TypeApplicationThermostat as AtHomeThermostat} from '_components/objects/thermostat/thermostat';

import {TypeDoorKeeper as AtHomeVDP} from '_brand/templates/components/objects/doorKeeper/doorKeeper';
//import {TypeQrCodeVDP as VDoorBell} from '_components/objects/qrBasic/qrCodeVDP';
import {TypeQrCodeVDP as VDoorBell} from '_brand/templates/components/objects/qrBasic/qrCodeVDP';

//import {Motor_1_WidgetView as BoardGate} from '_components/objects/boardgate/widget/';

export {
    AtHome2ChLight,
    AtHomeProbe,
    AtHomeLight,
    AtHomePlugOut,
    AtHomePlugIn,
    AtHomeModuleShutter,
    AtHomeModuleGate,
    AtHomeHeater,
    AtHomeBoiler,
    AtHomeWirePilot,
    WeatherSupport,
    AtHomeThermostat,
    AtHomeVDP,
    VDoorBell
   
}