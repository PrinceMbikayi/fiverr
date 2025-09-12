import React from 'react';
import { View } from 'react-native';

import {TypeDefaultDetails} from '_components/objects/default/defaultDetails';
import detailsScreens from './details/objectsDetails';  
import { useAppGlobal} from '_helpers/appGlobalProvider'; 
import {domusIcons} from '_assets/icons/domusIcons';
import { withTheme } from '_theming/themeProvider';


   const TypeDynamicDetails = (props) => { 

       const {typeName,itemName : name,newIcon, navParams, className} = props;
       const {itemId} = navParams;
        const {getObjectMapped} = useAppGlobal();

       
        
        const icon = (domusIcons[typeName] != undefined) ?  typeName+'.svg' : newIcon; 
       
        const getDetailComponent = () => {  
            // Harold test is composite in order to render its detail
            const compositeType = className=="Composite"? "composite" : null; 
            //console.log("ISCOMPOSITE HHH :", compositeType)  

            // Render group as first element nature and detail view 
            const myTypeName = getObjectMapped(typeName) || typeName;

            // Proper group detail view
            //const myTypeName = compositeType || getObjectMapped(typeName) || typeName;

            //const TypeObjectDetails = TypeDefaultDetails;           
            const TypeObjectDetails =  detailsScreens[myTypeName]  || detailsScreens[props.className] || TypeDefaultDetails;           
           
            return <TypeObjectDetails newIcon={icon} itemId= {props.itemId} statuses={props?.statuses} {...props} parameters={props.parameters}/>            
        }
        return (
            <View style={{flex:1,backgroundColor:"transparent"}}>
            {
                getDetailComponent()
            }
            </View>            
        )
    }
export default withTheme(TypeDynamicDetails);
