import BleManager from 'react-native-ble-manager';
import { NativeEventEmitter, NativeModules, Platform, PermissionsAndroid } from 'react-native';
import { find  as _find, findIndex as _findIndex} from 'lodash';
import { sleep } from './tools';
import { bytesToString } from './tools';


const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export  const scanForDevicesWithNamePrefix = async(prefix = '', scanDuration = 3000) =>{
    console.log("YTRTYUIOP scanForDevicesWithNamePrefix",prefix,scanDuration)
  
    return new Promise((resolve) => {
      const devices = [];
  
      const handler = bleManagerEmitter.addListener(
        'BleManagerDiscoverPeripheral',
        (peripheral) => {
          console.log('Discovered peripheral:');//, peripheral);
          const name = peripheral.name || peripheral.advertising?.localName;
          if (name && name.startsWith(prefix)) {
            devices.push(peripheral);
          }
        }
      );
  
      BleManager.scan([], scanDuration / 1000, false); // no duplicates
  
      setTimeout(() => {
        handler.remove();
        resolve(devices);
      }, scanDuration);
    });
  }
  

  
  // Read a characteristic from a peripheral
  async function readCharacteristic(peripheralId, serviceUUID, characteristicUUID) {
    try {
      const readData = await BleManager.read(peripheralId, serviceUUID, characteristicUUID);
      console.log(`Characteristic value: ${readData}`);
      return readData;
    } catch (error) {
      console.log('Error reading characteristic', error);
      return null;
    }
  }
  
  const retryReadCharacteristic = async (peripheralId, serviceUUID, characteristicUUID, retries = 3) => {
    let attempt = 0;
    while (attempt < retries) {
      try {
        const characteristic = await BleManager.read(peripheralId, serviceUUID, characteristicUUID);
        console.log('Characteristic value:', characteristic);
        return characteristic; // Success, return value
      } catch (error) {
        console.error(`Attempt ${attempt + 1} failed: ${error.message}`);
        if (attempt < retries - 1) {
          console.log('Retrying...');
          await new Promise(resolve => setTimeout(resolve, 1000)); // Delay before retry
        }
      }
      attempt++;
    }
    throw new Error('Failed to read characteristic after multiple attempts');
  };
  
 

  export  const connectToDevices = async (devices, filterValues) =>{

    console.log("IIIIIIIIIII connectToDevices",devices,filterValues)
    const {targetValue, characteristicUUID,deviceRef} = filterValues;


    // targetValue id the mac_address so we are looking for 
    const nameSearched = deviceRef+"_"+targetValue.split(":").slice(-2).join("");
    console.log("nameSearched",nameSearched)

    const lookFor = _find(devices,{name:nameSearched});

    const alreadyConnected  = await BleManager.getConnectedPeripherals([]);
    console.log("$$$$ alreadyConnected",alreadyConnected)

    console.log("lookFor",lookFor)

    if(!lookFor) {
        console.log("no device found with this name",nameSearched)
        return null;
    }


    let serviceUUID = null;
    await BleManager.disconnect(lookFor.id);
    await sleep(1000);
    await BleManager.connect(lookFor.id);

    await sleep(500);
    const peripheralInfo = await BleManager.retrieveServices(lookFor.id);
    const characteristicInfo = _find(peripheralInfo.characteristics,{characteristic:characteristicUUID});
    await sleep(500);

    const alreadyConnected2  = await BleManager.getConnectedPeripherals([]);
    console.log("$$$$ alreadyConnected2",alreadyConnected2)




    if (characteristicInfo) {
      console.log(`>>>> Characteristic info: ${JSON.stringify(characteristicInfo)}`);
        serviceUUID = characteristicInfo.service;
    }
    console.log(`XXXXXXXXXX Peripheral info: ${JSON.stringify(peripheralInfo)}`);
    console.log(`-------------------> peripheral.id, serviceUUID, characteristicUUID`,lookFor.id, serviceUUID, characteristicUUID);
   // const value = await readCharacteristic(lookFor.id, serviceUUID, characteristicUUID);

    const rowValue = await retryReadCharacteristic(lookFor.id, serviceUUID, characteristicUUID);
    const value = bytesToString(rowValue);
    console.log("******* value",value)

    const alreadyConnected3  = await BleManager.getConnectedPeripherals([]);
    console.log("$$$$ alreadyConnected3",alreadyConnected3)

    if (value && value === targetValue) {
      console.log(`Found target device: ${lookFor.name || lookFor.id}`);
      //do not disconnect here it's just a check
      //await BleManager.disconnect(lookFor.id);
      return lookFor; // Return the target peripheral
    }
    // Do not Disconnect after checking this device
    /*
    await BleManager.disconnect(lookFor.id);
    console.log(`Disconnected from ${lookFor.name || lookFor.id}`);
    console.log("no device found with this name in fact reading error",nameSearched)
    */
    return null;

    
    /*
    for (const peripheral of devices) {
      try {
        console.log(`Connecting to device: ${peripheral.name || peripheral.id}`);
  
        // Connect to the device
        console.log(`Connecting to ${peripheral.name || peripheral.id}`);
        await BleManager.connect(peripheral.id);
        console.log(`Connected to ${peripheral.name || peripheral.id}`);
  

        // retieve the services and characteristics
        const peripheralInfo = await BleManager.retrieveServices(peripheral.id);

        const characteristicInfo = _find(peripheralInfo.characteristics,{characteristic:characteristicUUID});
        await sleep(1000);
        
        if (characteristicInfo) {
          console.log(`Characteristic info: ${JSON.stringify(characteristicInfo)}`);
            serviceUUID = characteristicInfo.service;
        }
        // Log the peripheral info
        console.log(`Peripheral ID: ${peripheral.id}`);

        console.log(`XXXXXXXXXX Peripheral info: ${JSON.stringify(peripheralInfo)}`);

        // Read characteristic to identify the device
        
        // const targetValue = 'known_value'; // Replace with the known value you're looking for
        // const serviceUUID = 'your_service_uuid'; // Replace with the service UUID of the characteristic
        // const characteristicUUID = 'your_characteristic_uuid'; // Replace with the characteristic UUID you want to read
       
        console.log(`-------------------> peripheral.id, serviceUUID, characteristicUUID`,peripheral.id, serviceUUID, characteristicUUID);
        const value = await readCharacteristic(peripheral.id, serviceUUID, characteristicUUID);
        if (value && value === targetValue) {
          console.log(`Found target device: ${peripheral.name || peripheral.id}`);
          await BleManager.disconnect(peripheral.id);
          return peripheral; // Return the target peripheral
        }
  
        // Disconnect after checking this device
        await BleManager.disconnect(peripheral.id);
        console.log(`Disconnected from ${peripheral.name || peripheral.id}`);
      } catch (error) {
        console.log(`Error connecting or reading from ${peripheral.name || peripheral.id}`, error);
      }
    }
  */
    // If no device is found, return null
    return null;
  }


  // Connect to each device, read a characteristic, and identify the target device
  export  const connectToDevices2 = async (devices, filterValues) =>{

    console.log("IIIIIIIIIII connectToDevices",devices,filterValues)
    const {targetValue, characteristicUUID} = filterValues;
    let serviceUUID = null;
    for (const peripheral of devices) {
      try {
        console.log(`Connecting to device: ${peripheral.name || peripheral.id}`);
  
        // Connect to the device
        console.log(`Connecting to ${peripheral.name || peripheral.id}`);
        await BleManager.connect(peripheral.id);
        console.log(`Connected to ${peripheral.name || peripheral.id}`);
  

        // retieve the services and characteristics
        const peripheralInfo = await BleManager.retrieveServices(peripheral.id);

        const characteristicInfo = _find(peripheralInfo.characteristics,{characteristic:characteristicUUID});
        await sleep(1000);
        
        if (characteristicInfo) {
          console.log(`Characteristic info: ${JSON.stringify(characteristicInfo)}`);
            serviceUUID = characteristicInfo.service;
        }
        // Log the peripheral info
        console.log(`Peripheral ID: ${peripheral.id}`);

        console.log(`XXXXXXXXXX Peripheral info: ${JSON.stringify(peripheralInfo)}`);

        // Read characteristic to identify the device
        /*
        const targetValue = 'known_value'; // Replace with the known value you're looking for
        const serviceUUID = 'your_service_uuid'; // Replace with the service UUID of the characteristic
        const characteristicUUID = 'your_characteristic_uuid'; // Replace with the characteristic UUID you want to read
        */
        console.log(`-------------------> peripheral.id, serviceUUID, characteristicUUID`,peripheral.id, serviceUUID, characteristicUUID);
        const value = await readCharacteristic(peripheral.id, serviceUUID, characteristicUUID);
        if (value && value === targetValue) {
          console.log(`Found target device: ${peripheral.name || peripheral.id}`);
          await BleManager.disconnect(peripheral.id);
          return peripheral; // Return the target peripheral
        }
  
        // Disconnect after checking this device
        await BleManager.disconnect(peripheral.id);
        console.log(`Disconnected from ${peripheral.name || peripheral.id}`);
      } catch (error) {
        console.log(`Error connecting or reading from ${peripheral.name || peripheral.id}`, error);
      }
    }
  
    // If no device is found, return null
    return null;
  }
  
  const addAlreadyConnectedDevices = async() => {        
    const peripheralsArray = await BleManager.getConnectedPeripherals([])      
    return peripheralsArray;       
}
  
  export const getDeviceForIosId = async(props) => {
    console.log("doComplete getDeviceForIosId",props)
    const {name:deviceRef, board_mac:targetValue} = props;
    const similarDevices = await scanForDevicesWithNamePrefix(props.deviceRef, 5000);
    console.log('----------------> ++++Similar Devices:', similarDevices);

    const nameSearched = props?.advertiseName || deviceRef+"_"+targetValue.split(":").slice(-2).join("");
    console.log("nameSearched",nameSearched);


    const alreadyHere = await addAlreadyConnectedDevices();
    
    const lookFor = _find([...similarDevices,...alreadyHere],{name:nameSearched});
    console.log("lookFor",lookFor);
    if(!lookFor) {
        console.log("no device found with this name",nameSearched)
        return null;
    }
    //const findIt =  await connectToDevices(similarDevices,filterValues );
    const findIt = lookFor?.id
    console.log('----------------> ++++findIt:', findIt);

    return findIt;
   
  }
  
  
  
  
  
  // Usage in useEffect or other logic

  










  // Usage:
  //const targetDevices = await scanForDevicesWithNamePrefix('MyDevice', 5000);
  //console.log('Filtered Devices:', targetDevices);
  