import {Api} from '_api';
import Toast from 'react-native-root-toast';

export  const RECORD_ACTION_SNAPSHOT = 'snapshot';
export  const RECORD_ACTION_START_RECORDING = "start-video";
export  const RECORD_ACTION_END_RECORDING = "stop-video";

export const doRecordAction = (itemId,recordType) => {
    Api.executeAction(itemId,"RECORD",{mArgs:[{'name':'action',value:recordType}]});
}

export const openGate = (itemId) => {
    console.log("openGate",itemId)
    Toast.show("open gate",{position: Toast.positions.TOP});
    Api.executeAction(itemId,"GATE");
}

export const openDoor = (itemId) => {
    Toast.show("open door",{position: Toast.positions.TOP});
    Api.executeAction(itemId,"STRIKE");
}

export const decline = (itemId) => {
    console.log("before decline")
    const doDecline = Api.executeAction(itemId,"DECLINE");
}

export const hangUp = (itemId) => {
    const closeArgs = {mArgs:[{name:'value',value:JSON.stringify({"vdp_command":"hangup"})}]};
    const res = Api.executeAction(itemId,"ICE",closeArgs);
}

