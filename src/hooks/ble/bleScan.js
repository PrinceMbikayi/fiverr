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

  import {bytesToString,stringToByte,sleep, recomposeName} from './tools';
  import {bluetoothPairing as objectsToPairWithBle} from '_brand/config/products/brandProducts';

//-----------------------------------------------------


const useScan = () => {

  const SECONDS_TO_SCAN_FOR = 3;
  const SERVICE_UUIDS = [];
  const ALLOW_DUPLICATES = true;
  const BleManagerModule = NativeModules.BleManager;
  const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
  
  const peripheralsRef = useRef([]);

  const [scanStatus, setScanStatus] = useState("idle");
  useEffect(()=> {
    console.log("scanStatus",scanStatus)
  },[scanStatus]);

  const [scanResult, setScanResult] = useState("waiting");
  useEffect(()=> {
    console.log("scan result",scanResult)
  },[scanResult]);

  const [foundDevices, setFoundDevices] = useState([]);
  useEffect(()=> {
    console.log("[bleHook] foundDevices",foundDevices)
  },[foundDevices]);


  const searchFiltersRef = useRef({});

  const filterPeripherals= async(peripherals) => {

 

    console.log("BarandProducts bluetoothPairing",objectsToPairWithBle)
    
    console.log("searchFiltersRef.current",searchFiltersRef.current)
      const filtered = peripherals.reduce((r,v,i) => {         
          if(v.name) {  
            const deviceRefName = v.name.split('_')[0];   
              console.log("*** filterPeripherals (v.name) ***>",v.name,"->",deviceRefName) 

              const filterByRef = searchFiltersRef.current?.productReferences;
              if(filterByRef && filterByRef.indexOf(deviceRefName) == -1) {
                return r; // skip this device
              }
                        
              if(objectsToPairWithBle?.[deviceRefName]) {
                
                const pairingDatas = {...objectsToPairWithBle[deviceRefName]}
                console.log("pairingDatas",pairingDatas)
                  r.push({...pairingDatas,id:v.id,advertiseName:v.name})
              }           
          }
          return r;
      },[])   ;
    
      return filtered;
    }
  

    const handleDiscoverPeripheral = async peripheral => {
      console.log('-----------------> [app bleHook] handleDiscoverPeripheral', peripheral);
      const name = peripheral?.name ? peripheral.name : peripheral?.advertising?.localName;
      if(!name) return;
     // console.debug('-----------------> [app bleHook] handleDiscoverPeripheral', peripheral?.name);
    
      if (!peripheralsRef.current.find((el) => el.id === peripheral.id)) {          
          peripheralsRef.current.push(peripheral)
         // setPeripherals([...peripheralsRef.current]);
      }
    }
    
    const handleStopScan = () => {
      console.debug('[app bleHook] handleStopScan');
      readScanResults();
    }

    useEffect(() => {
      console.log("useScan Listeners activated",Date.now())
      const listeners = [
          bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral ),
          bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan),
         
        ];
    
     
    
      return () => {
        console.debug('[app] main component unmounting. Removing listeners...');
        for (const listener of listeners) {
          listener.remove();
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const startScan = async(options) => {

      console.log("So start Scan...",scanStatus)
      searchFiltersRef.current = options || {};

      // const isPermited = await checkAndroidPermissions();
      // if(!isPermited) {
      //   console.error("[startScan] Permissions not granted, cannot start scan.");
      //   navigation
      //   setScanStatus("notGranted");
      //   return;
      // }


      if(scanStatus === "idle" ) {
        peripheralsRef.current = [];
      
        
        console.log("du coup j'essaye de scanner",SERVICE_UUIDS,SECONDS_TO_SCAN_FOR,ALLOW_DUPLICATES)

        try {
          console.debug('[startScan] starting scan...');
          setScanStatus("scanning");
          console.log("go johnny go !!!!!!!!!")
          BleManager.scan(SERVICE_UUIDS, SECONDS_TO_SCAN_FOR, ALLOW_DUPLICATES, {
            matchMode: BleScanMatchMode.Sticky,
            scanMode: BleScanMode.LowLatency,
            callbackType: BleScanCallbackType.AllMatches,
          })
            .then(() => {
              console.debug('[startScan] scan promise returned successfully.');
            })
            .catch((err ) => {
              console.error('[startScan] ble scan returned in error', err);
            });
        } catch (error) {
          console.error('[startScan] ble scan error thrown', error);
        }
      }
    };

  //----------------- Stop Scan ---------------------
  const stopScan = () => {
      BleManager.stopScan();
         
      readScanResults()
  }

  //----------------- Add Already Connected Devices ---------------------
  const addAlreadyConnectedDevices = async() => {        
    const peripheralsArray = await BleManager.getConnectedPeripherals([])      
    return peripheralsArray;       
}
  //--------------------------------------
  const readScanResults = async() => {
    

    console.log("scan hook readScanResults ++",JSON.stringify(peripheralsRef.current))



    const availableDevices = peripheralsRef.current.reduce((r,v,i) => {  
        if(v?.name != null) {
        r.push(v)
        }
       return r
    },[]);
    console.log("**** availableDevices ****",availableDevices)
    const alreadyHere = await addAlreadyConnectedDevices();  
    console.log("**** alreadyHere ****",alreadyHere)  
    const updatedPeripherals = [...availableDevices,...alreadyHere]

    console.log("**** updatedPeripherals ****",updatedPeripherals)

    const filtered = await filterPeripherals(updatedPeripherals);
    console.log("**** filtered ****",filtered)
  

    setFoundDevices(filtered);
    if(filtered.length > 0) {
      setScanStatus("found");
    }
    if(filtered.length == 0) {
      setScanStatus("notFound");
    }

}


useEffect(()=> {
  console.log("---------->scanStatus",scanStatus)
},[scanStatus]);

       




    //-------------- Return ---------------------------
    return {
    
      startScan,
      stopScan,
      scanStatus,
      scanResult,
      foundDevices,
      foundDevice:foundDevices[0] || false,
    
    }
}

export default useScan;