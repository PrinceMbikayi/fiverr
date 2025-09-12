import {Type2ChLightDetails as AtHome2ChLight} from '_components/objects/2ChLight/2ChLightDetails';
import {TypeLightDetails as Light} from '_components/objects/light/lightDetails';
import {TypeLightDetails as AtHomeLight} from '_components/objects/light/lightDetails';

import {TypePlugDetails as AtHomePlugOut} from '_components/objects/plug/plugDetails';
import {TypePlugDetails as AtHomePlugIn} from '_components/objects/plug/plugDetails';

import {TypeShutterDetails as AtHomeModuleShutter} from '_components/objects/shutter/shutterDetails';
import {TypeGuardianDetails as AtHomeModuleGate} from '_components/objects/guardian/guardianDetails';
import {TypeHeaterDetails as AtHomeHeater} from '_components/objects/heater/heaterDetails';
import {TypeHeaterDetails as AtHomeBoiler} from '_components/objects/heater/heaterDetails';
import {TypeHeaterDetails as AtHomeWirePilot} from  '_components/objects/heater/heaterDetails';

import {TypeAtHomeProbeDetails as AtHomeProbe} from "_components/objects/atHomeProbe/atHomeProbeDetails";
import {TypeThermostatDetails as athome_thermostat} from "_components/objects/thermostat/thermostatDetails";

//import {TypeVDPDetails as AtHomeVDP} from "_components/objects/doorKeeper/doorKeeperDetails";
import {DoorKeeperCall as AtHomeVDP} from '_components/objects/doorKeeper/doorKeeperCall';
//import {QrCodeVDPCall as AtHomeVDP} from '_components/objects/qrBasic/qrCodeVDPCall';
import {QrCodeVDPCall as VDoorBell} from '_components/objects/qrBasic/qrCodeVDPCall';
//import {QrCodeVDPCall as VDoorBell} from '_brand/templates/components/objects/qrBasic/qrCodeVDPCall';


export {
    AtHome2ChLight,
    Light,
    AtHomeLight,
    AtHomePlugOut,
    AtHomePlugIn,
    AtHomeModuleShutter,
    AtHomeModuleGate,
    AtHomeHeater,
    AtHomeBoiler,
    AtHomeWirePilot,
    AtHomeProbe,
    athome_thermostat, 
    AtHomeVDP,
    VDoorBell
}