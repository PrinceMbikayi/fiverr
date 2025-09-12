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
import { NativeModules,  NativeEventEmitter,Platform,PermissionsAndroid} from 'react-native';


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
import handlePermissions from './permissions';
//-----------------------------------------------------

import {bytesToString,stringToByte,sleep, recomposeName,storeCaracteristics} from './tools';
import {connectWithRetry} from './tools';

import {getDeviceForIosId} from './bleIos';


//----------- hooks -----------------
import useDeviceBlueTooth from './deviceBlueTooth';
import useScan from './bleScan';
import useActions from './bleActions';

//-----------------------------------------------------
import {getNetworks} from './toolsWifi';


const useBle = () => {


    const BleManagerModule = NativeModules.BleManager;
    const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
    // =============== HOOK FOR ENABLING BLUETOOTH ON USER DEVICE ================
    const uDeviceBlueTooth = useDeviceBlueTooth();
    // =============== HOOK FOR SCANNING AND MANAGING BLE DEVICES =================
    const uScan = useScan();

   //const [deviceBoardModel, setdeviceBoardModel] = useState(null);
    //--------------------

  const [permissions, setPermissions] = useState(null);
   
  useEffect(()=> {
    console.log("Permissions_are_now",permissions)
  },[permissions]);



    const currentDeviceRef = useRef({id:null,name:null,connected:false});  
    const [currentDevice, setCurrentDevice] = useState({id:null,name:null,connected:false});
   
    
    useEffect(()=> {
      console.log("================ currentDevice =================== in BleHook =====",currentDevice)
    },[currentDevice]);

    const selectDevice = (theDevice) => {
      console.log("inBleHook selectDevice",theDevice)
      currentDeviceRef.current = {...theDevice};     
      console.log("inBleHook selectDevice device",theDevice)
     
     } 

    const mandatoryDeviceRefs = useRef([]);
    const selectedDeviceRef = currentDeviceRef;

    // =============== HOOK FOR MANAGING BLE ACTIONS =================
    const uActions = useActions({selectedDeviceRef,connectWithRetry});
    const {read,write} = uActions;

    const [objectId, setObjectId] = useState(null);

      const [checkStatuses, setCheckStatuses] = useState({});

    useEffect(()=> {

    },[checkStatuses]);

    // ======== INIT ====================
    // const checkPermissions = async () => {
    //   const handleAndroidPermissionResult = await handleAndroidPermissions();
    //   console.log("checkPermissions_permissionsResult :", handleAndroidPermissionResult)
    //   return handleAndroidPermissionResult;
    // }

      const checkPermissions = async () => {
      console.log("checkPermissions !!!!! ")

     const permissionsResult = await handlePermissions();
      console.log("checkPermissions_permissionsResult",permissionsResult);
     setPermissions(permissionsResult);
      return permissionsResult;
    }

    
    
    useEffect(()=> {    
      (async () => {
        setPermissions(await checkPermissions());
      })();     
    },[]);
    

    const [bleState, setBleState] = useState();
    useEffect(()=> {
      console.log("=====================> bleState",bleState)
    },[bleState]);



  const init = () => {
    console.log("should Init ble Here and remove previous init")
  }

  const [isConnected, setIsConnected] = useState(false);
  const hbRef = useRef(null);

  useEffect(()=> {
    console.log("[ BLE HOOK ]=====================> isConnected",isConnected)
    if(isConnected == true) {
      hbRef.current = setInterval(() => {
        checkConnectionHeartBeat(currentDeviceRef.current?.id)
      }, 5000);
    } else {
      clearInterval(hbRef.current);
    }
  },[isConnected]);

  const deviceBoardModelRef = useRef(null);
  /**
   * 
   * @param {object} infos 
   * @param {string} infos.deviceInfos
   * @param {object} infos.allCharacteristics
   * @param {boolean} [infos.isWizard] defautl false
   * @returns 
   */
  const initBle = async (infos) => {

    //setCheckStatuses({})

    console.log("initBle in BLE HOOK",JSON.stringify(infos)) 
    setCheckStatuses({isWizard:infos?.isWizard}); 
    setBleCheckActivated(true);

    

    console.log("p[1 - ste -initBle ]")//;, JSON.stringify(infos));
    const {deviceCharacteristics} = infos;


    let deviceInfos = {...infos?.deviceInfos};

   

    if(Platform.OS === 'ios' && !infos?.isWizard) {

      console.log("=====================> ios")
      

      const forIosId = await getDeviceForIosId({...infos?.deviceInfos});
      console.log(" in initBle =====================> forIosId",forIosId)
      deviceInfos.id = forIosId ;
     

    };



   // console.log("XXXCCC currentDeviceRef.current in initBle => ",JSON.stringify(currentDeviceRef.current))

    if(currentDeviceRef.current?.id !== deviceInfos?.id) {
      selectDevice({...deviceInfos, characteristicsByName: deviceCharacteristics || {}});
    }
    
    let btm = deviceInfos?.id;   
    console.log('Device ID (btm):', btm);
    const checkIsConnected = await BleManager.isPeripheralConnected(btm);
    console.log('hop checkIsConnected', checkIsConnected);
    if (!checkIsConnected) {
      
      selectDevice({...deviceInfos, characteristicsByName: deviceCharacteristics || {}});
      console.log('Not connected, so we need to connect btm', btm);
      const connectionAttempt = await uActions.connect(btm, true).catch(err => {
        console.log('connectionAttempt Connection error', err);
        setCheckStatuses({...checkStatuses, notFound: true,isWizard:deviceInfos?.isWizard});
      });
    console.log('connectionAttempt result', connectionAttempt);
      await sleep(100);
      if (connectionAttempt) {
     
        const looAtThix= {deviceInfos, characteristicsByName: deviceCharacteristics || {}}
       
        await sleep(100);

        // NEEDED FOR PAIRING SYSTEM POPUP
        const r = await read('BOARD_MODEL').catch(err => {
          console.log( 'err ReadBorad Status', err);
          console.log('so return false in  [1 - step -initBle ]');
          setIsConnected(false);
          disconnect(btm);
           setCheckStatuses({...checkStatuses, notFound: true,isWizard:infos?.isWizard});
          return false;
        });
        console.log( 'initBle completed', r);
        // HERE it's because the user doens't accept the pairing (ionding) request
        console.log( 'initBle BOARD_MODEL', r);

        setIsConnected(r!== false);
        deviceBoardModelRef.current = r;
        console.log(
          'deviceBoardModelRef.current',
          deviceBoardModelRef.current,
        );
        return r;
      } else {
        return false;
      }
    } else {
      // already connected so
      console.log("[2 - step - ! checkIsConnected ]")
      console.log('Already connected so you need to retrieve services');
      const peripheralData = await BleManager.retrieveServices(btm);
      console.log("peripheralData retrieved in initBle ");//,peripheralData);//)
  
      const currentDeviceState = {...selectedDeviceRef.current,characteristics:storeCaracteristics(peripheralData),connected:true};
     
      console.log("currentDeviceState => could be interisting");// ,JSON.stringify(currentDeviceState))
     
      selectDevice(currentDeviceState);

      const r2 = await read('BOARD_MODEL').catch(err => {
        console.log( 'err ReadBorad Status', err);
        console.log('so return false');
        disconnect(btm);
        setCheckStatuses({...checkStatuses, notFound: true,isWizard:infos?.isWizard});
        return r2;
      });
      deviceBoardModelRef.current = r2;
      console.log('Already connected so BOARD MODEL in BLE HOOKS', r2);
      console.log( 'deviceBoardModelRef.current', deviceBoardModelRef.current);
      
      if(r2)setIsConnected(true);
      return r2;
    }
  };


    //-------------- Connect ---------------------------
    const connect = async(peripheralId) => {     
      const connectResult =  uActions.connect(peripheralId);
      console.log("%%%%%%% connectResult %%%%%%%% ",connectResult)     
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

      const getConnectedPeripherals = async() => {
        const peripheralsArray = await BleManager.getConnectedPeripherals([])      
        return peripheralsArray;
      }

     const listenersRef = useRef([]);
       


      const addListener = (handler, eventName = 'BleManagerDidUpdateState') => {
         console.log('addListener ==>', handler, eventName);
         /*
          listenersRef.current.push(
            bleManagerEmitter.addListener(eventName, handler),
          );
          */
         console.log("addListener so return them before ",bleManagerEmitter)
          return bleManagerEmitter.addListener(eventName, handler)
        
        };

      // in order to remove the listeners
      useEffect(()=> {

          const them = listenersRef.current;
          return (
            
            them.forEach(l => {
              console.log("remove listener",l)
              l.remove();
            })
          );
        }
        ,[]);


        
      
        


        /**
         * be careful for device here seems to be the mobile
         * @returns {string}
         */
        const checkDeviceBlueTooth = async () => {
          console.log("Track this in order to remove it or not");     
          const btState = await BleManager.checkState();
          console.log("------ btState ---------",btState);        
          return btState;
        };


     
    const enabledDeviceBluetooth = async () => { 
        const doIt = await uDeviceBlueTooth.enabledDeviceBluetooth().catch(error => { console.log("error enabledDeviceBluetooth",error); return false;});
        return doIt;
    }


    const [bleCheckActivated, setBleCheckActivated] = useState(null);
    useEffect(()=> {
      if(bleCheckActivated == false) {
        setLostConnection(false);
        setIsConnected(false);
        setCheckStatuses({});
      }
    },[bleCheckActivated]);



    const [lostConnection, setLostConnection] = useState(false);

    useEffect(()=> {
      console.log("so connection is lost",lostConnection)
      setCheckStatuses({...checkStatuses, "lostConnection": lostConnection});
    },[lostConnection]);


    const checkConnectionHeartBeat = async (deviceId) => {
      const connected = await BleManager.getConnectedPeripherals([]);
      const isStillConnected = connected.some(d => d.id === currentDeviceRef.current.id);
      console.log("checkConnectionHeartBeat connected",connected);
      console.log("checkConnectionHeartBeat isStillConnected",isStillConnected);
      setLostConnection(!isStillConnected);
      setIsConnected(isStillConnected);
      //setCheckStatuses({})
    };

    useEffect(()=> {
      return () => {
        console.log("unmounting bleHook");
        clearInterval(hbRef.current);
       // setLostConnection(false);
      }
    },[]);

    const getWifiNetworks = async () => {
      console.log('YEAH-NETWORK');
      const r = await read('BOARD_MODEL').catch(err => {
       console.log('err ReadBorad Status', err);
      });
      const networks = await getNetworks(read, write);
      console.log('[getWifiNetworks]', networks);
      return networks;
    };

    const  getBoardModel  = () => {
      return currentDeviceRef.current;
    };
    const  getDeviceModel  = () => {
      return currentDeviceRef.current;
    };

 const startScan = async (options) => {
  const res = uScan.startScan(options)
  return res;
}


    //-------------- Return ---------------------------
    return {
        init, 
        initBle, 
        addListener,
        /* scan */     
        scanStatus:uScan.scanStatus,
        startScan:startScan,
        stopScan:uScan.stopScan,
        scanResult:uScan.scanResult,
        foundDevices:uScan.foundDevices,
        foundDevice:uScan?.foundDevices?.[0] || false,
        /* selecting / config */     
        selectDevice,
        selectedDevice:currentDeviceRef.current,
        /* check statuses */
        checkStatuses,
        setCheckStatuses,
        bleCheckActivated: bleCheckActivated,
        setBleCheckActivated,
        /* actions */
        connect,
        disconnect,
      
        isConnected:isConnected,
        currentDevice,
        getDeviceModel,
        getBoardModel,
        deviceBoardModel:currentDeviceRef.current,
        isArealdyConnected,
        getConnectedPeripherals,
        read:uActions.read,
        write:uActions.write,
        bleState,
        checkDeviceBlueTooth,
        enabledDeviceBluetooth,
        setCurrentDevice,
        /* object is in user Objects */
        objectId,
        setObjectId,
        permissions,
        /* wifi */
        getWifiNetworks,
       
    }
}

export default useBle;
