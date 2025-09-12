
import * as ObjectHelpers from '_helpers/objects';
import {athomeFamilyTypes} from '_config/products/core'

const _getSameFamilyProducts = (typeName,multi) => {

    let _sameFamilyProducts;
    console.log("_getSameFamilyProducts",typeName,multi)
    if(multi) {
        const multiKey = Object.keys(athomeFamilyTypes).reduce(function (r, k) {
            
            if(athomeFamilyTypes[k].indexOf(typeName) != -1) {
                console.log(k,'+++ -->',athomeFamilyTypes[k],typeName)
                r = athomeFamilyTypes[k]
            }
            return r;
        },[]);
        console.log("multiKey",multiKey)
        if(multiKey.length == 0) {
            _sameFamilyProducts = [];
        } else {
            _sameFamilyProducts = multiKey.reduce((r,v,i) => {
                const vIds = ObjectHelpers.getObjectsByTypeName(v)
                if(vIds)r = [...r,...vIds];
             
                return r;
            },[])
        }
       


    } else {
        _sameFamilyProducts = ObjectHelpers.getObjectsByTypeName(typeName); 
    }

    //console.log("_sameFamilyProducts",_sameFamilyProducts)
   
    if(_sameFamilyProducts) {
        const _items = _sameFamilyProducts.reduce(function(r,v,i){   
            const item =  ObjectHelpers.getObjectById(v)       
            if(item && item.typeName != "composite") {
               
                r[item.id] = {'name':item.name,'id':item.id,'typeName':item.typeName};
            }
            return r;
        },{})
        
        return _items
    }
    // if strangely there is no products with the unique type in the cmposite !!!!!
    return {};       
}



export const getSameFamilyProducts = (typeName,unique) => {
    const uniqueOnly = (unique != undefined) ? !unique : false; 
    return _getSameFamilyProducts(typeName,!uniqueOnly);
}