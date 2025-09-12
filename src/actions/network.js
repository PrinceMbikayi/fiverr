// reducer is network
export const NETWORK_REMIND_WIFI_PASSWORD_TEMP = 'NETWORD::REMIND::WIFI::PASSWORD::TEMP';
export const SERVER_IS_DOWN = 'APP::SERVER::IS::DOWN';

export function remindWifiPasswordTemp(wifiPassword){
  
    return {
      type: NETWORK_REMIND_WIFI_PASSWORD_TEMP,
      payload:{'wifiPasswordTemp':wifiPassword}
    };
  }



export const appServerIsDown = (val) => ({
  type:SERVER_IS_DOWN,
  payload:val
})