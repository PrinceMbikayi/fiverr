import {categories,products} from '_brand/config/products';
import {find as _find, findKey as _findKey} from 'lodash';

import {productByCommercialName} from '_config/products/core'

const productCategoryInfos = Object.entries(categories).reduce((r,v,i) =>{
    const cat = {[v[1].name] :{category: v[1]}}
    const devices = v[1].devices.reduce((rv,vv,iv) => {
        rv[vv] = {category:{...v[1]}}
        return rv
    },{})
    r = {...r,...devices,...cat}
    return r
},{});

/**
 * 
 * @param {*} theme 
 * @param {*} productId 
 * @returns 
 */
export const getBgColor = (props) => {
    
    const {theme,productId:pId,typeName} = props;    
    const productId = pId || _findKey(productByCommercialName,{'typeName':typeName}) || typeName;   
    const colorId = productCategoryInfos[productId]?.category?.tileColor || "#EEE";    
    const retVal = theme[colorId] || ((colorId.charAt(0) == '#')? colorId : '#CCCCCC');  

    return retVal;
}

