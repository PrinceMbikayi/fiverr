
import React, { Component } from 'react';

import {ProductDetailsScreen} from '../templates/screens/productsRelated/productDetails'


const Destinations = {  'default' : ProductDetailsScreen,                      
                    };

export const getDetailsComponent = (props) => {
   
   const params = props?.route?.params || {} ;
    const {typeName,appName} = params;  
    

    const MyDestination = Destinations[appName] ||  Destinations[typeName]; 

    // const MyDestination = Destinations['Thermostat']; 
    /* ne marche pas les params ne passent pas
    if(MyDestination) {
        return <MyDestination aa="aaa" initialParams={{a:1,b:2,c:3}}/>;
    }
    */

    return <ProductDetailsScreen />



   
}