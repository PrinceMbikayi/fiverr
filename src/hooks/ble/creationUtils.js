/* eslint-disable prettier/prettier */
import {Api} from '_api';
import {createObject, addStatus} from '_api/objects';

/**
 * @param {object} props
 * @param {string} props.subtype
 * @param {string} props.givenName
 * @param {string} props.bleMacAddress
 * @param {object} props.statusesToAdd
 * @returns Promise
 */
export const createOnServer = async props => {
  const {
    boardId: id,
    macAddress: mac_address,
    typeName = 'io/athome',
    type = 'gate',
    subType,
    givenName,
    bleMacAddress,
    statusesToAdd,
  } = props;

  console.log(
    'createOnServer in creationUtils du hook BLE',
    id,
    mac_address,
    subType,
    givenName,
  );

  const addDirectRnd = Math.ceil(Math.random() * 10000);
  const buildName = "SAT-OPROLL_" + mac_address.substr(-5, 6).split(":").join("");
  //const addDirectRnd = Math.ceil(Math.random() * 10000000);
  const name = givenName || buildName || ("SAT-OPROLL_" + addDirectRnd);
  //const name = givenName || ('Sat_op_roll_' + addDirectRnd).slice(0,16);
  const paramName = 'mac_address';
  const paramValue = mac_address;

  const params = {
    typeName: typeName,
    realName: {
      id: id,
      type: type,
      subtype: subType,
    },
    parameters: [
      {
        name: paramName,
        value: paramValue,
      },
    ],
    name: name,
  };
  console.log('-------------------> params', params);
  console.log('---------------> before params', params);
const params2 = {realName: ''+type+'/'+subType+'/'+id, name: name, typeName: typeName, parameters: [{name: paramName, value: paramValue}]};
console.log('---------------> params2', params2);

  //return false;
  const creationResp = await createObject(params2).catch(err => {
    console.log('error creation object', err);
  });
  console.log('createdOnServer in hooks/ble/creationUtils')//, creationResp);

  if (!bleMacAddress && !statusesToAdd) {
    return creationResp;
  }

  if (creationResp.errCode != 200 ) {
    return creationResp;
  }
  if (bleMacAddress) {
    const addBluetoothMac = await addStatus(
      creationResp.id,
      'android_peripheralId',
      bleMacAddress,
    );
    if (!statusesToAdd) {
      return addBluetoothMac;
    }
  }

  if (statusesToAdd) {
    const neverConnected = await addStatus(
      creationResp.id,
      'base_infos',
      JSON.stringify(statusesToAdd),
    );
    return neverConnected;
  }
};
