import React from 'react';
import PropTypes from 'prop-types';
import * as objectsWidgets from '_brand/templates/components/objects/@dynamics_brand/routines/routinesWidgets';
import { useAppGlobal } from '_helpers/appGlobalProvider';
import { Text, View } from 'react-native';


const applicationTypeMap = { 'athome_thermostat': 'AtHomeThermostat', 'Thermostat': 'Thermostat' }


function areEqual(prevProps, nextProps) {
    const prevStatus = prevProps?.statuses?.status;
    const nextStatus = nextProps?.statuses?.status;
    if (prevStatus == nextStatus == undefined) return false;
    //console.log("so @dynamic areEqual ?",prevStatus,nextStatus);
    const result = ((prevProps?.statuses?.status == nextProps?.statuses?.status) && nextProps?.statuses?.status != undefined)
    return result;
    /*
    return true if passing nextProps to render would return
    the same result as passing prevProps to render,
    otherwise return false
    */
}


//Question : get object mapped to what ??? 
export const getTypeNameMapped = (uObject) => {

    const { objectDatas, statuses, widgetReferenceDatas, isComposite } = uObject;
    //const typeName = uObject?.widgetReferenceDatas

    const { typeName } = widgetReferenceDatas || '';
    //const {typeName} = objectDatas;

    const applicationType = (typeName == 'application') ? applicationTypeMap[objectDatas?.appName] || applicationTypeMap[statuses?.__app_id] : null;
    const compositeType = isComposite ? objectDatas?.typeName : null;

    const { getObjectMapped } = useAppGlobal();
    // getObjectMapped allow to retrieve all objects  mapped to a given "typeName"
    // exemple:  typeName = Rolling_Shutter_Ezsp  has many object mapped to it:   

    //with this : a group will pick up the first elements nature and widget design
    //const myTypeName = applicationType || getObjectMapped(typeName) || typeName; 

    // Proper render for group widget
    const myTypeName = applicationType || compositeType || getObjectMapped(typeName) || typeName;
    //console.log("::::MMMMMM :", getObjectMapped(typeName))
    return myTypeName
}



const TypeDynamic = (props) => {

    //console.log("OBJECT WIDGET :::::: --- ::::", objectsWidgets)
    
    
    const { itemId, uObject, isRoutine} = props;
    console.log("----> Render TypeDynamic_ProfaluxBrand",props)
    /*
   const {objectDatas,statuses,widgetReferenceDatas,isComposite} = uObject;
   const {typeName} = widgetReferenceDatas;
   if(typeName == "application") {
      // console.log("bon application alors",statuses?.__app_id)
   }
   const applicationType = (typeName == 'application') ? applicationTypeMap[statuses?.__app_id] : 'notAnApplication'; 

   const {getObjectMapped} = useAppGlobal();
   */

    const getWidgetComponent = () => {

        const myTypeName = getTypeNameMapped(uObject) //getObjectMapped(typeName) || typeName;       
        //const TypeObjectWidget = objectsWidgets[applicationType] ||  objectsWidgets[testComposite]  ||  objectsWidgets[myTypeName] || objectsWidgets[props.className] || objectsWidgets['TypeDefault']   ;
        const TypeObjectWidget = objectsWidgets[myTypeName] || objectsWidgets[props.className] || objectsWidgets['TypeDefault'];
        console.log("OBJECT WIDGET :::::: ", myTypeName,  objectsWidgets[myTypeName])
        const icon = "empty";
        return (
        <View>
            {/* <Text>Type Dynamic element</Text> */}
            <TypeObjectWidget newIcon={icon} itemId={props.itemId} uObject={uObject} isRoutine={isRoutine}/>
        </View>)
    }


    return (
        <>
            {
                getWidgetComponent()
            }
        </>
    )
}
TypeDynamic.propTypes = {
    newIcon: PropTypes.string,
};
//export default TypeDynamic;

export default React.memo(TypeDynamic, areEqual);

/*********************** AVOID THIS MAJOR PROBLEM ******************
 * 
 * 
 *  By using the code below,  instead of function calling
 *  All items are rebuild each time the store  change, this mean that states and refs are useless
 *  
 * 
 * 
 * 
 * const WidgetComponent = () => {         
        const TypeObjectWidget = objectsWidgets[applicationType] ||  objectsWidgets[testComposite] ||  objectsWidgets[props.typeName] || objectsWidgets[props.className] || objectsWidgets['TypeDefault']          
       
        return <TypeObjectWidget newIcon={props.newIcon} itemId= {props.itemId} statuses={props.statuses} {...props}/>            
    }
 * 
 * 
 * return (
        <WidgetComponent/>
    )
 * 
 */
