/* eslint-disable react-hooks/exhaustive-deps */

/*
* No dependencies
* Inherited this way
* Could be used 
* Over ignored Values
* Loading a known damned-well method
* Ever and Ever
*/

import React, {useContext, useState, useEffect, useRef} from 'react';
import { NativeModules,  NativeEventEmitter,Platform} from 'react-native';

import BleManager, {
    BleDisconnectPeripheralEvent,
    BleManagerDidUpdateValueForCharacteristicEvent,
    BleScanCallbackType,
    BleScanMatchMode,
    BleScanMode,
    Peripheral,
    PeripheralInfo,
  } from 'react-native-ble-manager';


import {handleAndroidPermissions} from './androidPermissions';
//-----------------------------------------------------

import {bytesToString,stringToByte,sleep, recomposeName,storeCaracteristics} from './tools';



//----------- hooks -----------------




const useBleActions = (props) => {


  
  const {selectedDeviceRef,deviceConfigsRef} = props;
  console.log("============== useBleActions props")//,props)
  useEffect(()=> {
   // console.log("============== useBleActions selectedDevice in Actions",selectedDeviceRef)
  },[selectedDeviceRef]);





    const BleManagerModule = NativeModules.BleManager;
    const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

   

    //-------------- characteristics -------------------



    //-------------- Actions ---------------------------

    const actionPendingRef = useRef(false);

    //-------------- Connect ---------------------------
    const connect = async(peripheralId) => {
     
        const checkIsConnected = await isArealdyConnected(peripheralId);
        console.log("checkIsConnected",checkIsConnected)
        if(checkIsConnected) {          
           // handleConnectPeripheral({peripheral:peripheralId})
        }
          
        console.log("connect peripheralId",peripheralId)
      
        return new Promise(async (resolve, reject) => {
            BleManager.connect(peripheralId)
              .then(async() => {
                console.log("it's connected result so wait 200 ms");  
                await sleep(200); 
                console.log("retrieveServices peripheralId",peripheralId)
                const peripheralData = await BleManager.retrieveServices(peripheralId);  
                console.log("peripheralData",peripheralData)            
                const connectionResult = {...selectedDeviceRef.current,characteristics:storeCaracteristics(peripheralData),connected:true};
                console.log("connectionResult",JSON.stringify(connectionResult) )
                selectedDeviceRef.current = connectionResult;                    
               
                resolve(connectionResult);
              })
              .catch((err) => {   
                console.log("connect error",err);
                //BleManager.removePeripheral(peripheralId)
                console.log("[hook] is Rejected !! not found",err)           
                reject('not found');
              });
          });
      };
      //-------------- Disconnect ---------------------------
    const disconnect = async(peripheralId) => {
        return new Promise((resolve, reject) => {
            BleManager.disconnect(peripheralId)
              .then(() => {
                console.log('Disconnected');
                resolve();
              })
              .catch(error => {
                console.log('Disconnect error', error);
                reject(error);
              });
          }
        );
      };
    // ------------ utils ------------------------------

    const isArealdyConnected = async (peripheralId) => {
        const isConnected = BleManager.isPeripheralConnected(peripheralId,[]);
        return isConnected
    }

    //-------------- Write ----------------------------
    const write = async(characteristic, data) => {
        console.log('=========> Writing to with value', characteristic, data);
        const device = selectedDeviceRef.current;
        actionPendingRef.current = {action:'write',characteristic:characteristic,data:data}
        const checkConnected = await BleManager.isPeripheralConnected(device.id,[]);
        if(checkConnected) {
            console.log("checkConnected done")
            return await doPendingAction();
        } else {
            console.log("Not connected to device in bleAction")
            const testConnect = await connect(selectedDeviceRef.current.id);
            console.log("testConnect done")//,testConnect)
            if(testConnect) {
                console.log("testConnect done")
                const retVal = await doPendingAction();
                console.log("retVal",retVal)
                return retVal;
            }
        } 
        
    }

      //-------------- Read ----------------------------
    const read = async(characteristicName) => {
     
      console.log('Reading for ==>', characteristicName,readParams);
        const device = selectedDeviceRef.current;      
        const readParams = {action:'read',characteristic:characteristicName};       
        const checkConnected = await BleManager.isPeripheralConnected(device.id,[]);     
        if(checkConnected) {   
          console.log("checkConnected done readParams",readParams);

           const readResult = await doRead(readParams);
           console.log('readResult :', readResult);        
           return readResult;
        } else {
            console.log("[Actions.read] Not connected to device so connect it")
            const testConnect = await connect(selectedDeviceRef.current.id);
            console.log("[Actions.read] before check testConnect")//,testConnect)
            if(testConnect) {
                console.log("testConnect done 2nd pass")
                const retVal = await doRead(readParams);;
                console.log("retVal",retVal)
                return retVal;
            }
      } 
    }

    const doRead = async(params) => {

      console.log("doRead in hooks/ble");//,params,JSON.stringify(selectedDeviceRef.current))
      const {characteristic,data} = params;
      const device = selectedDeviceRef.current;
      //console.log("doRead device  in hooks/ble",JSON.stringify(device?.characteristicsByName ||"{}"))
      const characteristicName = characteristic;
      const characteristicId = device?.characteristicsByName[characteristicName]?.UUID;  
     // console.log("doRead characteristicId",characteristicId)        
      const deviceId = device.id;
     
     // console.log("device.characteristics[characteristicId]",device.characteristics[characteristicId])
      const service = device.characteristics[characteristicId].service;
     // console.log("XXXXXXXXXXXX service =>",service)

     // console.log("doRead necessary params => ",deviceId,service,characteristicId)
     //console.log(if needed for debug)
      const rowValue = await BleManager.read(deviceId, service, characteristicId).catch(error => { console.log("read error bleHook",error); return null;});
      const value = bytesToString(rowValue);
      console.log('MY_RETURN :', rowValue);
      console.log("doRead : characteristic, deviceId, service, characteristicId, => value",characteristic,deviceId, service, characteristicId, " => ",value)
      return value

    }
    //-------------- Do Pending Action true write or Read ----------------
    const doPendingAction = async() => {
       
        const device = selectedDeviceRef.current;
        console.log("doPendingAction device !!!!!!!! ")//,device)
        await sleep(500)
        if(actionPendingRef.current) {
            console.log("[doPendingAction] pending action",actionPendingRef.current)
            const {characteristic,data} = actionPendingRef.current;
            const characteristicName = actionPendingRef.current.characteristic;
            const characteristicId = device?.characteristicsByName[characteristicName]?.UUID;

            console.log("characteristicId",characteristicId)
            const deviceId = device.id;
            const service = device.characteristics[characteristicId].service;
            switch(actionPendingRef.current.action) {
                case 'write':
                  console.log('DATA_SENT_TO_WRITE :', data);
                    const dataFormatted = stringToByte(data.toString()); 
                    const maxBytes = 185;
                    console.log("dataFormatted",dataFormatted)
                    return new Promise((resolve, reject) => {
                        BleManager.write(deviceId, service, characteristicId, dataFormatted, maxBytes)
                          .then(() => {
                            actionPendingRef.current = false;
                            console.log('Write success :',characteristicId);
                            resolve();
                          })
                          .catch(error => {
                            console.log(`Write error ${characteristicId}`, error);
                            actionPendingRef.current = false;
                            reject(error);
                          });
                      }); 
                    break;
                case 'read':
                     console.log("Read : deviceId, service, characteristicId",deviceId, service, characteristicId)
                    const rowValue = await BleManager.read(deviceId, service, characteristicId).catch(error => { console.log("read error bleHook",error); return null;});
                    actionPendingRef.current = false;                   
                    const value = bytesToString(rowValue);
                    console.log("XXXXX value",value)
                    actionPendingRef.current = false;
                    console.log("so return value",value)

                    return value;
                    break;
            }
        }
      }




      






       

    //-------------- Return ---------------------------
    return {
     
        /* actions */
        connect,
        disconnect,
       read,
       write
       
    }
}

export default useBleActions;
