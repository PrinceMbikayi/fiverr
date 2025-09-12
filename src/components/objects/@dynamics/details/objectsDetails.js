/*
export * from './objectsDetailsAtHome';
export * from './objectsDetailsAirwell';
export * from './objectsDetailsEzsp';
*/
import * as a from './objectsDetailsAtHome';
import * as b from './objectsDetailsEzsp';

import * as brand from '_components/objects/@dynamics_brand/details/objectsDetails'
const c = {...a,...b,...brand}

console.log("c",c)
export default c




