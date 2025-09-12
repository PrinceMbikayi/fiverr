/* eslint-disable react-hooks/exhaustive-deps */
import React, {useContext, useState, useEffect, useRef} from 'react';
import {useStore, useSelector} from 'react-redux';
import {getTypeNameObjects} from '_helpers/selectors';
import { Platform } from 'react-native';
//-----------------------------------------------------
import {recomposeName,getDeviceBleCharacteristicsMap} from '../tools' ;
//import deviceReferences from './blePairingObjects.json';
import {getObjectById} from '_helpers/objects';
//-----------------------------------------------------


const useFilters = (uBle) => {


    const {currentDevice} = uBle;

    const deviceReferences ={}

    const typeNameObjects = useSelector(state => getTypeNameObjects(state));    
    const searchInObjectsRef = useRef(null);
    const store = useStore();

    const fillSearchInObjectsRef = (deviceReferenceName) => {      

        const typeName = deviceReferences[deviceReferenceName]?.typeName;  
       
        const devicesInTypeName = (typeNameObjects[typeName] ||[]).reduce((r,v,i) => {
            r.push( getObjectById(""+v))
            return r;
        }
        ,[])
       // console.log("devicesInTypeName",devicesInTypeName)
        return devicesInTypeName;
      
    }


    const specialIos = async(peripheral,uBle) => {
        if(Platform.OS == "ios") {
            const isAlreadyConnected = uBle.isArealdyConnected(peripheral.id)
            console.log("pour la platform ios",peripheral)
            const connectionResult = await  uBle.connect(peripheral.id);
            if(connectionResult) {
               // console.log("connectionResult",connectionResult)
            }
            const mapped = getDeviceBleCharacteristicsMap(recomposeName(connectionResult?.name))
           // console.log("mapped here =========",mapped)
            const uuid = mapped['BOARD_MAC'].UUID;
            //console.log("-- uuid --",uuid)
            const board_mac = await uBle.read(uuid);
            //console.log("----------> board_mac More ",board_mac)
            return board_mac;
        } else {
            return null;
        }
    }

   
    useEffect(()=> {
        /*
        console.log(">>>>>>>>>>>>>>>>>>< currentDevice in Pairing Hook",currentDevice)
       
        const mapped = getDeviceBleCharacteristicsMap(recomposeName(currentDevice?.name))
        console.log("mapped",mapped)
        const doBe = async() => {
            console.log(" doBe !!!")
            const board_mac = await uBle.read(mapped['BOARD_MAC'].UUID)
            console.log("----------> board_mac",board_mac)
        }
        doBe();
        */
    },[currentDevice]);

    const filterObjectNotInUserDevices = async(peripheral,uBle,mandatoryDeviceRefs) => {

        const deviceReferenceName = recomposeName(peripheral.name);
        console.log("mandatoryDeviceRefs",mandatoryDeviceRefs)
       if(mandatoryDeviceRefs.indexOf(deviceReferenceName) == -1 && mandatoryDeviceRefs.length > 0) {
            console.log("the ref is not in mandatory devices")
           return false;
       }
        const objectsInSameType = fillSearchInObjectsRef(deviceReferenceName);
       
        let deviceBleMacFromIos = null;
        if(Platform.OS == "ios") {
            console.log("ios => isConnected",uBle.isconnected )
            deviceBleMacFromIos = await specialIos(peripheral,uBle)
        }

       console.log("so i can check the device now",deviceBleMacFromIos)  


        const checkIt = objectsInSameType.reduce((r,v,i) => {
            const {statusDictionary : statuses} = v

            const verify =  statuses?.__user_android_peripheralId || statuses?.bluetooth_mac;
            if(verify == deviceBleMacFromIos || peripheral.id) {
                r = true;
            }
            return r;
        },false)
        
       


        return (!checkIt);
      
    }

    const filterObjectExists = async(peripherals,uBle,mandatoryDeviceRefs) => {

       console.log("filterObjectExists",peripherals,mandatoryDeviceRefs)

        let result = [];
        console.log("filterObjectExists async",peripherals)
        for(let i = 0; i < peripherals.length; i++) {
            const notInUserDevices = await filterObjectNotInUserDevices(peripherals[i],uBle,mandatoryDeviceRefs);
            console.log("notInUserDevices +++",notInUserDevices)
            if(notInUserDevices) {
                result.push(peripherals[i])
            } else {
                console.log("-> the device ",peripherals[i], "is already in the user devices")
            }
        }
        return result;
    }

    //-------------- Return ---------------------------
    return {        
        filterObjectExists       
    }
}

export default useFilters
