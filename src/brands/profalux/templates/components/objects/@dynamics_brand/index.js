import React from 'react';
import PropTypes from 'prop-types';
import objectsWidgets from './widgets/objectsWidgets';
import {useAppGlobal} from '_helpers/appGlobalProvider';


const applicationTypeMap = {'athome_thermostat': 'AtHomeThermostat','Thermostat':'Thermostat'}


function areEqual(prevProps, nextProps) {
    const prevStatus = prevProps?.statuses?.status;
    const nextStatus = nextProps?.statuses?.status;
    if(prevStatus == nextStatus == undefined) return false;
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

    const {objectDatas,statuses,widgetReferenceDatas,isComposite} = uObject;   
    
    const {typeName} = widgetReferenceDatas || '';
    //const typeName = uObject?.widgetReferenceDatas?.typeName;
    //const {typeName} = objectDatas;

    const applicationType = (typeName == 'application') ? applicationTypeMap[objectDatas?.appName] || applicationTypeMap[statuses?.__app_id] : null; 
    //const compositeType = isComposite ? objectDatas.typeName : null ;

    const {getObjectMapped} = useAppGlobal();  
    // getObjectMapped allow to retrieve all objects  mapped to a given "typeName"
    // exemple:  typeName = Rolling_Shutter_Ezsp  has many object mapped to it:   
    
    //with this : a group will pick up the first elements nature and widget design
    const myTypeName = applicationType || getObjectMapped(typeName) || typeName; 

    // Proper render for group widget
    //const myTypeName = applicationType || compositeType || getObjectMapped(typeName) || typeName; 
    return myTypeName
}



const TypeDynamic= (props) => {  
   
    const {itemId, uObject} = props;
     /*
    const {objectDatas,statuses,widgetReferenceDatas,isComposite} = uObject;
    const {typeName} = widgetReferenceDatas;
    if(typeName == "application") {
    }
    const applicationType = (typeName == 'application') ? applicationTypeMap[statuses?.__app_id] : 'notAnApplication'; 

    const {getObjectMapped} = useAppGlobal();
    */

    const getWidgetComponent = () => {             
       
        const myTypeName = getTypeNameMapped(uObject) //getObjectMapped(typeName) || typeName;       
       //const TypeObjectWidget = objectsWidgets[applicationType] ||  objectsWidgets[testComposite]  ||  objectsWidgets[myTypeName] || objectsWidgets[props.className] || objectsWidgets['TypeDefault']   ;
        const TypeObjectWidget =  objectsWidgets[myTypeName] || objectsWidgets[props.className] || objectsWidgets['TypeDefault'] ;
        const icon = "empty";       
        return <TypeObjectWidget newIcon={icon}  itemId= {props.itemId} uObject={uObject}/>            
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
