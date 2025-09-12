import '_brand/templates/screens/_locales'
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector, useDispatch, useStore } from 'react-redux';
import { useObject } from '_hooks/object';
import { getObjectsByTypes, getLoadedObjects } from '_helpers/selectors';
import { getObjectById } from '_helpers/objects';
import { RenameObject } from '_brand/templates/components/objects/common/RenameObject';
import Button from '_brand/templates/components/ui/Button';
import { Api } from '_api';
import * as Durin from '_api/durin';
import { useTheme } from '_theming/themeProvider'
import * as Actions from '_actions/objects';
import Toast from 'react-native-root-toast';
import { refreshObjectAction } from '_actions/asyncActions';
import {updateObject} from '_api/objects'

import { SimpleForm } from '../components/SimpleForm';

import {BoxScreenTemplate} from "_brand/templates/screens/account/components/BoxScreenTemplate"
import {EditBoxForm} from '_brand/templates/screens/account/components/EditBoxForm'



export const ModifyBox = () => {

  const store = useStore()
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const navigationParams = route?.params || {};

  const { t, i18n } = useTranslation();

  //console.log("NAVIGATION PARAMS :", navigationParams);
  const { boxId} = navigationParams;
  const uBox = useObject(boxId);
  const boxName = uBox?.name
  //   const { name: groupName, ComponentsTypes: componentsTypes } = uGroup?.objectDatas || {}
    const renameRef = useRef(null);
  //   const objectClassName = uGroup?.objectDatas?.className
  console.log("Box data : ", uBox);






  const handleSubmit = async (values) => {
    const boxNewName = values?.boxName
    console.log("BOX_NAME :", values)
    const gwData = getObjectById(boxId)
    const gatewayTrueId = Number(gwData?.gw)

    console.log('GATEWAY_TO_MODIFY :', gatewayTrueId, gwData);
    const requestRename = await Api.modifyGateway(gatewayTrueId, boxNewName).catch((err) => console.log(err));

    console.log("RENAME_RESPONSE 1:", requestRename)

    if(requestRename.errCode == 200){

        const action = Actions.objectUpdateProperty(boxId,'name',boxNewName);
        dispatch(action);
        const refreshBox = await refreshObjectAction(boxId, store).catch((err) => console.log("ERROR_REFRESH_BOX_ID :",err)); 
        navigation.navigate("MyGateways")

    }else {
      
        let message = `${t("account:SERVER_ERROR")} : ${requestRename.errCode} ${requestRename.errMsg}`;
        Toast.show(
          message,
          {
            backgroundColor: 'red',
            textColor: 'white',
            textStyle: { fontSize: 16, fontWeight: '600' },
            position: Toast.positions.CENTER,
            duration: 3000,
            onHide: () => { }
          }
        );

    }
  


  }

  const submitMe = () => {
    renameRef.current.submitForm();
  }


  const { theme } = useTheme();

  const borderColor = theme?.prflxBorderColor || 'orange';
  const containerbgcolor = theme?.prflxContaintBgColor || 'white';
  const bgcolor = theme?.prflxbgColor || 'white';
  const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor || "white";
  const textColor = theme?.prflxTextColor || 'black'
  const headerBgColor = theme?.prflxHeaderBackground || '#FFFFFF'
  const iconColor = theme?.prflxIconColor || "#3E495E";
  const iconBgColor = theme?.prflxIconbgColor || "#FFFFFF";

  const goBack = () => {

    navigation.goBack();
  }



  return (
    <BoxScreenTemplate withKebab={false} title={boxName}  >
        
        <View style={[styles.bodyContent, { backgroundColor: containerbgcolor }]}>
            <Text style={[styles.text, { marginVertical: 10 }]}> {t( "account:RENAME_BOX")}</Text>

            <View style={{marginBottom:20}}>

              <EditBoxForm  
                  ref={renameRef} 
                  oldName = {boxName}
                  submit={handleSubmit}  
                  bgColor={textColor} 
                />

            </View>
            <View style={styles.validateButton}>
                <Button onPress={submitMe} altStyle titleColor='white' title={t("account:MODIFY")} bgColor={textColor} noBorder />
            </View>
        </View>
    </BoxScreenTemplate>

  )
}

const styles = StyleSheet.create({
  headerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: 'orange',
    borderBottomWidth: 2,
    height: '6%',
    backgroundColor: "red"
  },
  bodyWrapper: {
    flex: 1,
    flexDirection: 'column',
    //backgroundColor:'#d5e0e4',
    //padding:10,
  },
  bodyContent: {
    // flex: 1,
    // justifyContent: 'space-evenly',
    padding: 5,
    borderColor: 'orange',
    borderWidth: 2,
    borderRadius: 10,
    //width:width*0.94,
   marginVertical: 10,
  }
})