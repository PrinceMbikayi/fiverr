import React from 'react';
import {useContext,useState,useEffect} from 'react';
import { SafeAreaView } from 'react-native';
import { useSelector} from "react-redux";
import { useTranslation } from 'react-i18next';
import {difference as lodashDifference} from 'lodash'

import { athomeFamilyTypes} from '_config/products/core';
import { SimpleListWithReorder} from '../templates/SimpleListWithReorder';
import { useTheme} from '_theming/themeProvider'
import { HeaderWithMenu } from '_components/headers/header-with-menu';
import {getOrderedList,setOrderedList} from '_services/storage';

import { getObjectById,getAllObjects,getObjectsByTypeName,getObjectsByTypes } from '_helpers/selectors';

import {AutomatedTestIdDisplay} from '_components/objects/@common/testAutomation/AutomatedTestId';


export const FamilyProductsScreen = ({navigation,route}) => {
  
    const { t, i18n } = useTranslation();
    const {theme } = useTheme();
    const navParams = route?.params || {}
   const productType = navParams.type;
   const [objectsArray, setObjectsArray] = useState([]);
    const objectsState = useSelector(state => state);
    //dataGetObjectsByTypeName
   const objectsByTypeNames = useSelector(getObjectsByTypeName);
   const objectsByTypes = useSelector(getObjectsByTypes);
   
    
    useEffect(() => {       
        //let gobt = getObjectsByType(objectsState,productType);        
        //setObjectsArray(gobt)
    }, []);
  
    useEffect(()=> {
        
        let gobt = getFamilyProducts(productType)
       

        async function getList(listId,didis) {
            let orderedIds = await getIds(listId,didis);
            
            // removed items ?
            const removed = lodashDifference(orderedIds,orderedIds)
           
            //added items ?
            const added = lodashDifference(didis,orderedIds)
           
            if(added.length > 0) {
                //orderedIds = orderedIds.concat(added);
                orderedIds = added.concat(orderedIds);
                await setOrderedList(listId,orderedIds);
            }
           
           
            setObjectsArray(orderedIds)
          }

          getList(productType,gobt)




    },[objectsByTypeNames,objectsByTypes])

    const  getFamilyProducts = (type) => {
        const showTypes = athomeFamilyTypes[type];  
        const typesAllowed = (showTypes == undefined || showTypes.length == 0) ? [] : showTypes;
        const retVal = typesAllowed.reduce(function(r,v,i){          
            const addThat = objectsState.objects.objectsByTypeNames[v];           
            if(addThat == undefined) return r;           
            r.push(...addThat);
            return r;           
          },[]);

          // if heater add application thermostat
          let addApplicationIds = []
          if(type == "HEATER" ) {
              //console.log("objectsState.objects.objectsByTypeNames",objectsState.objects.objectsByTypeNames)
            const applications = objectsState.objects.objectsByTypeNames['application']
            if(applications && applications.length > 0) {
                //console.log("applications",applications)
                addApplicationIds = applications.reduce((r,v,i) => {
                    const toTest = objectsState.objects.entities.objects[v];
                    if(toTest == undefined)return r
                    //console.log("toTest",toTest)
                    if(toTest.statusDictionary && toTest.statusDictionary.__app_id && toTest.statusDictionary.__app_id == "athome_thermostat")r.push(v)
                    return r;
                },[])
            }


          }

        const ids = [...retVal,...addApplicationIds];
        return ids;
    }


    const getIds = async(listId,didis) => {
        const list = await getOrderedList(listId);      
        if(list.length > 0) return list
        // ======      
        const addList = await setOrderedList(listId,didis);
        return addList;

    }

    const accessibilityLabel = "Screen_"+productType

    return (
        <SafeAreaView style={{flex:1,minHeight:200,minWidth:300,backgroundColor:theme['body-with-cards']}} accessibilityLabel={accessibilityLabel}>
            <HeaderWithMenu title={t("productTypes:"+productType.toUpperCase())}/>
            <AutomatedTestIdDisplay autoTestId={accessibilityLabel}/>
            <SimpleListWithReorder 
                    source={objectsArray}
                    listId={productType}
                    maintenanceNeeded={0}
            />
        </SafeAreaView>  
    );
}


const styles = {
    title : {
        color: '#fff',
        fontSize:20
    }
}