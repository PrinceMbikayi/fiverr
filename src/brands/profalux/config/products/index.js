import {values as _values} from 'lodash';
//------------------------------------------
export const categories =  require('./categories.json');


export const products = [
    ...(_values(categories))
];


