
/*
import {TypeDefault} from '_components/objects/default/default';
export {TypeDefault}

export * from './objectsWidgetsAtHome';
export * from './compositesWidgetsAtHome';

export * from './objectsWidgetEzsp';
*/



import {TypeDefault} from '_components/objects/default/default';
export {TypeDefault}

import  * as a from './objectsWidgetsAtHome';
import  * as b from './compositesWidgetsAtHome';
import  * as c from './objectsWidgetEzsp';
import  * as brand from '_components/objects/@dynamics_brand/widgets/objectsWidgets'
const d = {TypeDefault,...a,...b,...c,...brand}

export default d
