import '_components/objects/doorKeeper/locales';

import React from 'react';
import {useContext,useState,useEffect} from 'react';
import {  View, Text,StyleSheet,Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';
import { Menu, MenuOptions, MenuOption, MenuTrigger,} from 'react-native-popup-menu';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useMimic} from '_hooks/mimic'
import { useNavigation,useRoute } from '@react-navigation/native';

import * as Actions from '_actions/objects';
import { Api } from '_api';
import { useTheme } from '_theming/themeProvider';
import { ShowAlert } from '../alert';
import { getId,hasRDependencies,getRDependencies,isLastInRType } from '../utils';


export const PureItemRenderMenu = (props) => {

    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {}; 
    
    const {itemDatas,callbacks,listId} = props;
    const itemId = itemDatas.id;
    const {typeName,connected} = itemDatas;
    const  isApplication= itemDatas?.statusDictionary?.__app_id;

    const { t, i18n } = useTranslation();   
    const {theme} = useTheme();
    const dispatch = useDispatch(); 
    const {isTester,canDisguise} = useMimic();

    useEffect(() => {   
      // console.log("Menu params",props)
       
    }, []);

    // =============== COMMON =======================
    const showDetails = () => {
       
        // device real id
        const hasId = getId(itemDatas)
        const firmware = itemDatas?.statusDictionary?.__firmware;
        const hasFirware = (firmware != undefined) ? "\n\nfirmware :" + firmware : "";       
        const detailsBody = "name : " + itemDatas?.name + hasId + hasFirware;   
    
        ShowAlert(t("OBJECT_DETAILS_TITLE").toUpperCase(),
          detailsBody,
          [{
            text: t("OK").toUpperCase(), onPress: () => console.log('ok Pressed'), style: 'cancel'
          }
          ]
        )
      }
      //----------------------------------------------------
      const canDeleteObject = () => {
      
        let checkRDependencies = hasRDependencies(itemDatas); 
        console.log("checkRDependencies",checkRDependencies)   
        if(checkRDependencies == false) return true;
        const whichDependencies = getRDependencies(itemDatas);   
        console.log("whichDependencies",whichDependencies)
        if(whichDependencies?.groups?.length == 0 && whichDependencies?.applications?.length == 0)return true;
        
        console.log("so check last in group now !!!")
        
        let alertBody = "";
    
          const lastInGroups = isLastInRType(itemDatas,"groups");
          console.log("lastInGroups",lastInGroups)
          if(lastInGroups) {
            alertBody += t("CANT_DELETE_OBJECT_IN_GROUP",{'count':lastInGroups?.number,'objectName':itemDatas?.name,'groupName':lastInGroups?.names.join(", ")});
           
          }
          if(!lastInGroups) {
            return true;
          }
          
          ShowAlert( t("DELETE_OBJECT_ALERT_TITLE").toUpperCase(),
                          alertBody,
                        [ 
                          { text: t("OK").toUpperCase(), onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                          
                        ]
          )
          return false;
        }



      const deleteObject = async () => {

        const canDelete = canDeleteObject();
        console.log("canDelete",canDelete);        
        if(canDelete) {
         const  res = await Api.deleteObject(itemId).catch((err) => { console.log(err) });
          if (res.errCode == 200) {           
            const action = Actions.objectDelete(itemId);    
            dispatch(action)
          }
        }       
      }





      const deleteObjectConfirm = () => {

        ShowAlert(t("DELETE_OBJECT_ALERT_TITLE").toUpperCase(),
          t("DELETE_OBJECT_ALERT_BODY"),
          [
            { text: t("CANCEL").toUpperCase(), onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
            { text: t("DELETE").toUpperCase(), onPress: deleteObject }
          ]
        )
      }



    //------- THERMOSTAT --------------
    const goThermostatSetting = () => {
        const objParameters = itemDatas?.parameters;
        const {delay, probe_id,heater_ids} = objParameters
        const myParams = { delay, probe_id, heater_ids, 'appName': itemDatas?.name }
        const itemId = itemDatas?.id;
        let destination;
        switch (listId) {
          case 'all':
            destination = 'ThermostatComponentUpdateInAll';
            break;
          default:
            destination = 'ThermostatComponentUpdateInProductStack';
    
        }
        navigation.navigate(destination, { itemId: itemId, update: true, parameters: myParams })
      }

    // ------ SHUTTER -------------------
    const calibrateConfirm = () => {
        ShowAlert(t("SHUTTER_CALIBRATE_ALERT_TITLE").toUpperCase(),
          t("SHUTTER_CALIBRATE_ALERT_BODY"),
          [
            { text: t("CANCEL").toUpperCase(), onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
            { text: t("VALIDATE").toUpperCase(), onPress: () => calibrateShutter() }
          ]
        )
      }
    
    const calibrateShutter = async () => {
        const res = await Api.executeAction(itemId, 'CALIBRATE');
        console.log("calibrateShutter",res)
    
    }



    const availableCommands = {

        /*"renameObjectEnabler": renameObjectEnabler,*/
        "deleteObjectConfirm": deleteObjectConfirm,
        "calibrateConfirm": calibrateConfirm,
        "goThermostatSetting": goThermostatSetting,
        /*
        "manageComposite": this.manageComposite,
        "manageDisguise" : this.manageDisguise,*/
        "showDetails": showDetails,
        
      }

   const executeCommand = (value) => {
      console.log("executeCommand",value,callbacks)
        if(availableCommands?.[value]) {
            availableCommands[value]();
        } else {

            if(callbacks && callbacks[value] != undefined) {
            
                callbacks[value]();
            }
        }


        //console.log("executeCommand",value)
   }

    return (
        <Menu onSelect={executeCommand}>
            <MenuTrigger><Icon name="more-vert" size={30} color="#777777"/></MenuTrigger>                 
            <MenuOptions>                   
            {typeName == "composite" &&                     
                <MenuOption value="manageComposite" text={t("MANAGE_GROUP")} />
            }
            {typeName == "AtHomeModuleShutter" &&                     
                <MenuOption value="calibrateConfirm" text={t("CALIBRATE")} disabled={!connected}/>
            }
            {
                ( typeName == "application" &&  isApplication == "athome_thermostat" ) &&
                <MenuOption value="goThermostatSetting" text={t("thermostat:THERMOSTAT_UPDATE_TITLE")} />
            }
            <MenuOption value="renameObjectEnabler" text={t("RENAME")} />
            <MenuOption value="deleteObjectConfirm" >
                <Text>{t("DELETE")}</Text>
            </MenuOption>
            <MenuOption value="showDetails" text={t("DETAILS")} />
            {/*
            <MenuOption onSelect={() => alert(`Not called`)} disabled={true} text='Disabled' />
            */}
            {/*isTester &&
            <MenuOption onSelect={() => alert(`Not called`)} disabled={true} text='isTester' />
            */}
            {canDisguise(typeName) &&
                <MenuOption value="manageDisguise" text="Comportement" />
            }
            </MenuOptions>
        </Menu>
    )
}
