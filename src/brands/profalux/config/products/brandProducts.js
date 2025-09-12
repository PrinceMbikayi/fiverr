import './locales/index';

import products from './productsPairing.json';


// you can add other Brand products
// as it's a merge of objects, put current brand at the end of the spread
const brandProductsPairingInfos = {...products}



const buildBluetoothPairing = () => {
    const ret = Object.keys(products).reduce((r,v,i) => {
        const currentProduct = products[v]
       
        if(currentProduct?.pairing == "bluetooth") {
            r[currentProduct.reference] = currentProduct;
        }  
        return r         
    },{})
   
    return ret;
}

const bluetoothPairing = buildBluetoothPairing();

export {brandProductsPairingInfos,bluetoothPairing}
