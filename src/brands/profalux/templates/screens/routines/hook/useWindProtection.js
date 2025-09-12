import '_brand/templates/screens/routines/locales'
import React, { useContext,useRef, useEffect, useState } from "react";
import { getObjectById } from '_helpers/objects';
import * as ApiObjects from "_api/objects"
import { Api } from '_api';
import { getObjectsVisible, getObjectsByTypes, getObjectsByTypeName } from '_helpers/selectors';
import { useDispatch, useStore } from "react-redux";
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ScenarioContext } from '_brand/templates/screens/routines/context'
import {extractMultipleParamFromWindProtection} from '_brand/templates/screens/routines/utils/windProtectionUtils'
import {getApps} from '_api/objects'
import { myToast } from '_brand/templates/components/ui/myToast';
import { refreshObjectAction } from '_actions/asyncActions';
import { extractDailyRoutines } from '_brand/templates/screens/routines/utils/index'
import { set } from 'dot-prop-immutable';




/**
 * 
 * @returns {void} 
 */
export const useWindProtection = () => {

    const navigation = useNavigation();
    const { t, i18n } = useTranslation();
    const tns = "routine";
    const dispatch = useDispatch();
    const store = useStore()


    if (useContext(ScenarioContext) == undefined) return {}

    const { 
        windProtectionIdentity, setWindProtectionIdentity, 
        //shuttersToprotect, setShuttersToProtect
    } = useContext(ScenarioContext);


    const onclickObjectToProtect = (id) => {
        const windProtectData = getObjectById(id);
        const typeName = windProtectData?.typeName

        const shuttersToprotect = windProtectionIdentity.shutters
        const position = windProtectionIdentity.shutters?.indexOf(id)
        if (position == -1) {
            if(typeName == "Rolling_Shutter_Profalux"){
                const message = `${t(tns + ":" + "WARNING_NEOSOL_SELECTED")}`
                myToast(message, "red", "white", 2000)
            }
            //setShuttersToProtect([...shuttersToprotect, id])
            setWindProtectionIdentity({ ...windProtectionIdentity, shutters: [...shuttersToprotect, id] })
        } else {
            //let newSelection = [...ecoSelection]
            let newSelection = [...windProtectionIdentity.shutters]
            newSelection.splice(position, 1);
           //setShuttersToProtect(newSelection)
            setWindProtectionIdentity({ ...windProtectionIdentity, shutters: newSelection })
        }
    }

    function resetWindProtectionIdentity(probeId=null) {
        setWindProtectionIdentity({
            windProtectionId: null,
            windProtectionName: `${t(tns + ":" + "WIND_PROTECTION")}`,
            threshold:30,
            probe: probeId||null,
            shutters: []
        })
        //setShuttersToProtect([])
    }

    function initWindProtectionIdentity(id) {
        const windProtectObject = getObjectById(id);
        const windProtectId = windProtectObject?.id;
        const windProtectName = windProtectObject?.name;
        const windProtectParams = windProtectObject?.parameters
        const windProtectStoreParams = extractMultipleParamFromWindProtection(windProtectParams, ["shutters", "threshold", "probe"])
        const {probe:probe, shutters:shutters, threshold:threshold} = windProtectStoreParams
        //.split(",").map(Number)
        console.log('WIND_PROTECT_OBJECT :', "id :", windProtectId, "name :", windProtectName, "params :", windProtectStoreParams);
        console.log('WIND_SPREAD_PARAMS :', probe, shutters.split(",").map(Number), threshold);
        setWindProtectionIdentity({
            ...windProtectionIdentity,
            windProtectionId: windProtectId,
            windProtectionName: windProtectName,
            probe: probe? parseInt(probe):null,
            shutters: shutters.split(",").map(Number),
            threshold: threshold? parseInt(threshold):30,
        })

    }


    const createWindProtection = async() => {
        const parameters =[
            {name:"shutters", value:windProtectionIdentity?.shutters},
            {name:"threshold", value:windProtectionIdentity.threshold},
            {name:"probe", value:windProtectionIdentity.probe},
        ]
        const result = await ApiObjects.createWindProtectiontApplication(windProtectionIdentity?.windProtectionName,parameters).catch((err) => console.log(err));
        console.log('CREATE_WIND_PROTECTION_SERVER_RESPONSE :', result);
        if(result?.errCode == 200){
            const windProtectId = result?.id
            const refreshWindProtection = await refreshObjectAction(windProtectId, store).catch((err) => console.log("ERROR_REFRESH_WIND_PROTECTION : ",err));
            resetWindProtectionIdentity()
            navigation.navigate('RoutinesHomeScreen', { screen: 'RoutinesHomeScreen' });
        }else{
            console.log('CHECK_400_1 :');
            const errCode = result?.errCode;
            const errMsg = result?.errMsg;
            const message = `${t(tns + ":" + "SERVER_ERROR")} : ${errCode} ${errMsg}`
            myToast(message)
            navigation.navigate('RoutinesHomeScreen', { screen: 'RoutinesHomeScreen' });
        }
        return result
    }

    const updateWindProtection = async() => {
        const parameters =[
            {name:"shutters", value:windProtectionIdentity?.shutters},
            {name:"threshold", value:windProtectionIdentity.threshold},
            {name:"probe", value:windProtectionIdentity.probe},
        ]
        const id = windProtectionIdentity?.windProtectionId
        const name = windProtectionIdentity?.windProtectionName
        const result = await ApiObjects.updateWindProtectiontApplication(name, id, parameters).catch((err) => console.log(err));
        console.log('UPDATE_WIND_PROTECTION_SERVER_RESPONSE :', result);
        if(result?.errCode == 200){
            const windProtectId = result?.id
            const refreshWindProtection = await refreshObjectAction(windProtectId, store).catch((err) => console.log("ERROR_REFRESH_WIND_PROTECTION : ",err));
            resetWindProtectionIdentity()
            navigation.navigate('RoutinesHomeScreen', { screen: 'RoutinesHomeScreen' });
        }else{
            console.log('CHECK_400_1 :');
            const errCode = result?.errCode;
            const errMsg = result?.errMsg;
            const message = `${t(tns + ":" + "SERVER_ERROR")} : ${errCode} ${errMsg}`
            myToast(message)
            navigation.navigate('RoutinesHomeScreen', { screen: 'RoutinesHomeScreen' });
        }
        return result
    }


  


    return {
        windProtectionIdentity, setWindProtectionIdentity,
        //shuttersToprotect, setShuttersToProtect,
        onclickObjectToProtect, 
        initWindProtectionIdentity,
        createWindProtection,
        resetWindProtectionIdentity, updateWindProtection
    }
}
