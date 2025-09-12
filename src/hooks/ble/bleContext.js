import React, {useContext, useState, useEffect, useRef} from 'react';

import useBle from './bleHook';
import {recomposeName} from './tools';
import { createOnServer } from './creationUtils';
import { useStore } from 'react-redux';
import {refreshObjectAction, refreshObjectOnServerResponse} from '_actions/asyncActions';

const BleContext = React.createContext();

export const BleContextProvider = (props) => {

  const store = useStore();
    const {children} = props;
    const {references} = props;
   // console.log("BleWizardContextProvider props",props)
     const uBle = useBle();

    const {read,selectedDevice,setObjectId} = uBle;
    useEffect(()=> {
        uBle.init({
            deviceRefs: references
        });
    },[]);
    const {isBleEnabled} = uBle;
    useEffect(()=> {
        //needed for state update
    },[isBleEnabled]);

    const startScan = async(options) => {
        console.log("startScan in BLEContext => scan")
        uBle.startScan(options)
    }

    useEffect(()=> {
        console.log("BleContextProvider useEffect foundDevice",uBle.foundDevice)
    },[uBle.foundDevice]);


    const getSubType = () => {
        //for unconnected only uObject?.objectDatas?.subType i.e. : motor
        console.log("getSubType in hooks/ble ");//,selectedDevice)
        const subType = selectedDevice?.subType;
        console.log(' subType is ', subType);
        return subType;
      };


      const doCreateOnServer = async myParams => {
        console.log('doCreateOnServer ok this time',myParams);
        // add err catch
        const boardId = await read('BOARD_ID');
        console.log('boardId', boardId);
        const macAddress = await read('BOARD_MAC');
        console.log('macAddress', macAddress);

        const bleMacAddress = await read('BLUETOOTH_MAC');
        const board_firmware = await read('BOARD_FIRMWARE');
       
        const nameFroCreation = myParams?.name || "AAAAA"; // in fact name exists
        console.log("ok opn peut continuer 2")
        const subType = getSubType();
        const board_model = await read('BOARD_MODEL');
        console.log("before statusesToAdd",selectedDevice)
        const statusesToAdd = {board_firmware, board_model,advertiseName:selectedDevice?.advertiseName};
        const params = {
          boardId,
          macAddress,
          bleMacAddress,
          nameFroCreation,
          typeName: selectedDevice?.typeName || 'io/athome',
          type: selectedDevice?.type || 'gate',
          subType,
          statusesToAdd,
          deviceName:selectedDevice?.name
        };
        console.log("selectedDevice",JSON.stringify(selectedDevice) );

       
        console.log('[new BLE] doCreateOnServer params', JSON.stringify(params));


        const resp = await createOnServer(params);
        console.log('doCreateOnServer resp in hooks/ble/bleContext.js', JSON.stringify(resp));
        if (resp.errCode == 200) {
          setObjectId(resp.id);
          // needed to update object datas in store
          const id = resp?.id
          const resource = resp?.res?.data?.resource
          const refresh = await refreshObjectOnServerResponse(id, resource, store).catch((err) => console.log(err)); 
          console.log('SESAME_REFRESH', refresh);
          //refreshObjectAction(resp.id, store);
         // onComplete();
        }
    
        return resp;
        if (resp.errCode == 400 && resp.errMsg == 'object_exists_elsewhere') {
          /*
          (errorRef.current = 'CREATE_PROGRESS_OBJECT_EXISTS_ELSEWHERE'),
            setProgress('error');*/
        }
      };

      const onAbortWizard = () => {
        const objectId =  uBle.objectId; //in case object was created during wizard
        console.log("onAbortWizard in uBle Hook objectId",objectId);
       
        //uBle.stopScan();
        //uBle.disconnect();
        //uBle.setIsAborted(true);
      }

    // -- init is used in settings mode, in wizard it's not needed --
   

    const shared = {
        glop: "glop2",
        initBle: uBle.initBle,
        addListener: uBle.addListener,
        startScan,
        scanStatus: uBle.scanStatus,
        foundPeripherals: uBle.foundPeripherals,
        foundDevice: uBle.foundDevice,
        foundDevices: uBle.foundDevices,
        selectDevice: uBle.selectDevice,
        selectedDevice: uBle.selectedDevice,
        getBoardModel: uBle.getBoardModel,
        deviceBoardModel: uBle.deviceBoardModel,
        getDeviceModel:uBle.getDeviceModel,
        setDeviceConfigs: uBle.setDeviceConfigs,
        connect: uBle.connect,
        disconnect: uBle.disconnect,
        isConnected:uBle.isConnected,
        
        read: uBle.read,
        write: uBle.write,
        setBleCharacteristicsMap: uBle.setBleCharacteristicsMap,
        getWifiNetworks: uBle.getWifiNetworks,
        bleState: uBle.bleState,
        checkDeviceBlueTooth: uBle.checkDeviceBlueTooth,
        scanResult:uBle.scanResult,
        disconnectDevice: uBle.disconnect,
        enabledDeviceBluetooth: uBle.enabledDeviceBluetooth,
        doCreateOnServer,
        objectId: uBle.objectId,
        setObjectId: uBle.setObjectId,
        permissions:uBle.permissions,
        /* check statuses */
        bleCheckActivated: uBle.bleCheckActivated,
        setBleCheckActivated: uBle.setBleCheckActivated,
        checkStatuses: uBle.checkStatuses,
        setCheckStatuses: uBle.setCheckStatuses,
     
         /* wifi */
         getWifiNetworks:uBle.getWifiNetworks,
         /* wizard */
         onAbortWizard:onAbortWizard,
        setIsAborted:(() => {
           console.log("[toDo] setIsAborted");
           console.log("Attention si pn ajoute une propriété en dessous ça pose problème")
           uBle.stopScan();
        }),
       
    }

    return (
        <BleContext.Provider value={shared}>
            {children}
        </BleContext.Provider>
    )
}
export const useBleContext = () => {
  return useContext(BleContext);
};