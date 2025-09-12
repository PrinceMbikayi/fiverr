import {Alert} from 'react-native';

export const getServicesAndCharacteristics = async (bleManager, deviceID) => {
  // Mandatory if not called bleManager won't 'see' services
  const discover = await bleManager.discoverAllServicesAndCharacteristicsForDevice(
    deviceID,
  );

  console.log('YYYYYYYYY', bleManager, deviceID);
  const services = await bleManager.servicesForDevice(deviceID);
  console.log('XXXXXX services', services);
  let characteristics = {};
  if (services) {
    await Promise.all(
      services.map(async service => {
        const service_characteristics = await bleManager
          .characteristicsForDevice(deviceID, service.uuid)
          .catch(error => null);
        service_characteristics.map((v, i) => {
          characteristics[v.uuid + ''] = v;
        });
      }),
    );
  }

  return {services: services, characteristics: characteristics};
};

/**
 *
 * @param {*} characteristicId
 * @param {*} allCharacteristics
 * @returns
 */
export const getCharacteristicId = (characteristicId, allCharacteristics) => {
  console.log(
    'characteristicId',
    characteristicId,
    'allCharacteristics',
    allCharacteristics,
  );

  let realCharacteristicId = allCharacteristics?.[characteristicId]?.UUID;
  // console.log(" realCharacteristicId direct",realCharacteristicId)
  if (realCharacteristicId == undefined && characteristicId.length == 4) {
    //console.log("ben inside")
    const kkeys = Object.keys(allCharacteristics);
    const foundUUID = kkeys.reduce((r, v, i) => {
      const target = characteristicId.toLowerCase();
      const potentialTarget = v.substring(4, 8);
      //console.log(target,v,allCharacteristics[v],"(",potentialTarget,")")
      if (target == potentialTarget) {
        r = v;
      }
      return r;
    }, '');
    //console.log("foundUUID ("+foundUUID+")")
    if (foundUUID == '') return null;
    realCharacteristicId = allCharacteristics[foundUUID];
  }

  return realCharacteristicId;
};

//==========================================

const errorMessages = {
  default: {title: 'Erreur !!', message: 'erreur indéterminée'},
  'BleError: Location services are disabled': {
    title: 'Localisation nécessaire ',
    message: 'activez la localisation',
  },
  'BleError: BluetoothLE is powered off': {
    title: 'Bluetooth inactif',
    message: 'activez le bluetooth',
  },
};
export const bleScanError = error => {
  console.log('error', error);
  const toShow = errorMessages[error] || errorMessages['default'];
  if (error) {
    Alert.alert(toShow.title, toShow.message, [{text: 'ok'}], {
      cancelable: true,
    });
  }
};
