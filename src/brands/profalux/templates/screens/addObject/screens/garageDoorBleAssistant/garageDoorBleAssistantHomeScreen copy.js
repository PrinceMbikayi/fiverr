import '_brand/templates/screens/addObject/locales'
import React, { useEffect, useRef, useState } from 'react';
import { View, SafeAreaView, Text,PermissionsAndroid,Alert, Button, Linking, useFocusEffect } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useTheme } from '_theming/themeProvider';
import { Body } from '_brand/templates/screens/addObject/components/Body';
import { HeaderScreen } from '_brand/templates/screens/addObject/components/HeaderScreen';
import { CardImageArrow } from '_brand/templates/screens/addObject/components/addBoxComponents/CardImageArrow';
import { getAllObjects, getObjectsByTypeName, getObjectsVisible } from '_helpers/selectors';
import { Api } from "_api";
import { getObjectById } from '_helpers/objects';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import {useGlobalModal} from '_components/ui/globalModal'
import {GlobalToast} from '_brand/templates/components/objects/common/GlobalToast'
import {GlobalToastWithImage} from '_brand/templates/components/objects/common/GlobalToastWithImage'
import {useBleContext} from '_hooks/ble/bleContext';


export const garageDoorBleAssistantHomeScreen = () => {


    const navigation = useNavigation();
    const uBleContext = useBleContext();

    const { t, i18n } = useTranslation();
    const tns = "addObject";

    const globalModal = useGlobalModal(); 

    const {permissions} = uBleContext
    console.log('YOUPI_CHECK :', permissions);

    const { theme } = useTheme();
    const bgcolor = theme?.prflxbgColor || 'white';
    const textColor = theme?.prflxTextColor || 'black'

        const messageRef = useRef("")
        const modalTitleColorRef = useRef("#3E495E")
        const modalToastBgColorRef = useRef("white")
        const modalBodyTextColorref = useRef("#3E495E")
        const modalToastTitleRef = useRef(t("account:WARNING"))
        const buttonsRef = useRef([...buttons])

    const [bluetoothActivatedButton, setBluetoothActivatedButton] = useState("PoweredOff");

    useEffect(()=> {
        // if(permissions == "denied"){
        // Alert.alert(
        //   'Permission Denied',
        //   'You have denied Bluetooth permission. Please enable it from settings.',
        //   [
        //     {
        //       text: 'Go to Settings',
        //       onPress: () => Linking.openSettings(),
        //     },
        //     { text: 'Cancel',
        //       onPress: navigation.navigate("AddObject")},
        //   ]
        // );
        //     //handleDeniedPermission()
        //     //navigation.navigate("AddObject")
        // }
    },[permissions]);


    const handleDeniedPermission = async () => {
      const permissionStatus = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT);
      if (permissionStatus === false) {
        Alert.alert(
          'Permission Denied',
          'You have denied Bluetooth permission. Please enable it from settings.',
          [
            {
              text: 'Go to Settings',
              onPress: () => Linking.openSettings(),
            },
            { text: 'Cancel',
              onPress: navigation.navigate("AddObject")},
          ]
        );
      }
    };
    


    const handleOnPressNextArrow = (label) => {
        console.log('BLUETOOTH_STATE :',permissions["blePermissionOk"],permissions,  bluetoothActivatedButton);
        const blePermission = permissions["blePermissionOk"]

        if(blePermission ==false){
            // Do nothing : wait for automatic alert PERMISSIONS_REFUSED
        }else{
            if( bluetoothActivatedButton == "PoweredOn" ){
                    navigation.navigate("BleEquipmentSearchScreen",{"deviceType":"SesameGate",references:["SAT-OPROLL"]})
                }else{
                        modalToastTitleRef.current =""
                        messageRef.current = bluetoothActivatedButton == "PoweredOff" ? t(tns + ":" + "BLUETOTH_MANDATORY_FOR_OPROLL"): t(tns + ":" + "GIVE_CALYPSHOME_BLUETOOTH_PERMISSION")
                        modalBodyTextColorref.current = textColor
                        buttonsRef.current = bluetoothActivatedButton == "PoweredOff" ? buttons : returnButton
        
                        onOpenSelect()
                }

        }
        

        // if(permissions == 'denied'){
        //     modalToastTitleRef.current =t(tns + ":" + "BLE_ACCESS") //à utiliser le Bluetooth ?
        //     messageRef.current = t(tns + ":" + "GIVE_CALYPSHOME_BLUETOOTH_PERMISSION")
        //     modalBodyTextColorref.current = textColor
        //     buttonsRef.current = permissionsButtons

        //     onOpenSelect()
        // }else{

        //     if( bluetoothActivatedButton == "PoweredOn" ){
        //         navigation.navigate("BleEquipmentSearchScreen",{"deviceType":"SesameGate",references:["SAT-OPROLL"]})
        //     }else{
        //             modalToastTitleRef.current =""
        //             messageRef.current = bluetoothActivatedButton == "PoweredOff" ? t(tns + ":" + "BLUETOTH_MANDATORY_FOR_OPROLL"): t(tns + ":" + "GIVE_CALYPSHOME_BLUETOOTH_PERMISSION")
        //             modalBodyTextColorref.current = textColor
        //             buttonsRef.current = bluetoothActivatedButton == "PoweredOff" ? buttons : returnButton
    
        //             onOpenSelect()
        //     }
        // }
    }

    /////////////////////---BLUETOOTH LISTENER---/////////////////////
    const onActivateDeviceBlooth = async () => {
        console.log('PERMI :',permissions);
        if (Platform.OS == 'android') {
        await BluetoothStateManager.requestToEnable();
        }
        if (Platform.OS == 'ios') {
            Linking.openURL('App-prefs:root=Bluetooth');
        }
    };

    const addBluetoothListener = () => {
        BluetoothStateManager.onStateChange(bluetoothState => {

            console.log('BluetoothStateManager onStateChange', bluetoothState)

            if (bluetoothState == 'PoweredOn') {
            console.log('so............');
            setBluetoothActivatedButton("PoweredOn")
            } else {
            setBluetoothActivatedButton("PoweredOff")
            }

            console.log('UFX bluetoothState', bluetoothState);
        }, true);

    };

      useEffect(() => {
        addBluetoothListener();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

    // useFocusEffect(
    // React.useCallback(() => {
    //     addBluetoothListener();
    //     // Do something when the screen is focused
    // }, []) 
    // )

    /////////////////////---BLUETOOTH LISTENER---/////////////////////

    //???????????????????????????????????????????????????????????
        const returnButton = [
                        {
                id:"return",
                text:`${t(tns + ":" + "RETURN")}`,
                action:()=>onCancelPressed(),
                textColor:"#007AFF"
            },
        ]
        const buttons = [
            {
                id:"return",
                text:`${t(tns + ":" + "CANCEL")}`,
                action:()=>onCancelPressed(),
                textColor:"#007AFF"
            },
            {
                id:"validate",
                text:`${t(tns + ":" + "ACTIVATE")}`,
                action:()=>onValidate(),
                textColor:"#007AFF"
            }
        ]
        const permissionsButtons = [
            {
                id:"return",
                text:`${t(tns + ":" + "CANCEL")}`,
                action:()=>onCancelPressed(),
                textColor:"#007AFF"
            },
            {
                id:"validate",
                text:`${t(tns + ":" + "SETTINGS")}`,
                action:()=>goPermissions(),
                textColor:"#007AFF"
            }
        ]
    
      const onCancelPressed = () => {
        console.log('CANCEL_DELETE :');
        globalModal.close();
      }
      const onValidate = () => {
        onActivateDeviceBlooth()
        navigation.navigate("AddObject")
        globalModal.close();
      }

      const goPermissions=()=>{
        Linking.openSettings()
        navigation.navigate("AddObject")
        globalModal.close();
      }
    
      const onOpenSelect = () => {  
          const content = (
            <View style={{width:"95%", backgroundColor:'transparent',alignSelf:'center',justifyContent:'center',alignItems:'center', borderRadius:14}}>
                <GlobalToastWithImage 
                    toastTitle={t(tns + ":" + "WARNING")}
                    //toastBody={t(tns + ":" + "BLUETOTH_MANDATORY_FOR_OPROLL")}
                    toastBody={messageRef.current}
                    buttons={buttonsRef.current}
                />
            </View>
                )
          globalModal.setContent(content,{type:'centered'});    
          globalModal.toggle();
      }
    //???????????????????????????????????????????????????????????



    let content = (
        <View style={{ backgroundColor: 'transparent' }}>
            <Text style={{ fontSize: 16, fontWeight: '400', color: textColor, margin: 10, textAlign:'center' }} >{t(tns + ":" + "EQUIP_TYPE_CHOICE")}:</Text>
            <CardImageArrow
                onPressNextArrow={handleOnPressNextArrow}
                withNextArrow={true}
                imageSource={require('_brand/templates/screens/addObject/images/armoireOpRoll.png')}
                textDisplay={t(tns + ":" + "GARAGE_DOOR_OPROLL_EQUIP")}
                textStyle={{ marginRight: 10 }}
                imgStyle={{ width: 60, height: 80 }}
                label={"garageDoor"}
            />
        </View>
    )

    return (
        <SafeAreaView>
            <View style={{ alignItems: 'center', justifyContent: 'flex-start', backgroundColor: bgcolor, paddingTop: 20 }}>
                <HeaderScreen title={t(tns + ":" + "EQUIP_CHOICE")} goBack={() => navigation.navigate("AddObject")} />
                <Body style={{ marginTop: 20, }}>
                    <View>{content}</View>
                </Body>
            </View>
        </SafeAreaView>

    )
};
