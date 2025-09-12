import {sleep} from '_brand/utils/tools';

const maxWait = 30; //12; //4

export const getNetworks = async (read, write) => {
  console.log('Start Wifi Scan');
  await write('WIFI_SCAN', 1);
  console.log('before wait 4000', Date.now());
  await sleep(maxWait * 1000);
  console.log('scanDone !!', Date.now());
  let networksStringified = await read('WIFI_NETWORKS');
  console.log('networksStringified :',typeof(networksStringified), networksStringified);
  if (networksStringified === "" || networksStringified === "[]"|| networksStringified == "") {
    return [];
  }
  const reString = /\{(.*?)\}/gm;
  const re = networksStringified.match(reString);
  const cleanedNetworks = '[' + re.join(',') + ']';
  console.log('cleanedNetworks', cleanedNetworks);
  const networks = JSON.parse(cleanedNetworks);
  console.log('cleanedNetworks Parsed', networks);
  return networks;
};

export const disableWifi = async (write) => {

  const emptySSID = await write('WIFI_ssid','');

  const askConnect = await write('WIFI_CONNECT',1)

  return askConnect

}