import configJson from '_brand/templates/components/objects/sesame/sesameConfig.json';
//import motor761003ConfigJson from '_brand/templates/components/objects/boardgate/motor761003Config.json';



const config = {
  'SAT-OPROLL': configJson?.SESAME
};

export const devicesConfig = {
  ...config,
  
};
