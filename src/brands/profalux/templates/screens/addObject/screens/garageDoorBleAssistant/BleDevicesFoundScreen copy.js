import '_brand/templates/screens/addObject/locales'
import React from 'react';
import { View, SafeAreaView, Text, Button } from 'react-native';
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
import { MyButton } from '_brand/templates/components/ui/MyButton';
import {useGlobalModal} from '_components/ui/globalModal'
import {GlobalToast} from '_brand/templates/components/objects/common/GlobalToast'

export const BleDevicesFoundScreen = (props) => {
    const {devices,onNext, handleEquipmentNotVisible} = props

    const navigation = useNavigation();

    const { t, i18n } = useTranslation();
    const tns = "addObject";

    //const globalModal = useGlobalModal(); 

    const { theme } = useTheme();
    const bgcolor = theme?.prflxbgColor || 'white';
    const textColor = theme?.prflxTextColor || 'black'

        //     //???????????????????????????????????????????????????????????
        //     const buttons = [
        //         {
        //             id:"return",
        //             text:`${t(tns + ":" + "RETURN")}`,
        //             action:()=>onCancelPressed(),
        //             textColor:"#007AFF"
        //         },
        //         {
        //             id:"validate",
        //             text:`${t(tns + ":" + "PAIR")}`,
        //             action:()=>onPairPressed(),
        //             textColor:"#007AFF"
        //         }
        //     ]
        
        //   const onCancelPressed = () => {
        //     console.log('CANCEL_DELETE :');
        //     globalModal.close();
        //   }
        
        //   const onOpenSelect = () => { 
        //       const content = (
        //         <View style={{width:275, backgroundColor:'transparent',alignSelf:'center',justifyContent:'center',alignItems:'center', borderRadius:14}}>
        //             <GlobalToast 
        //                 toastTitle={t(tns + ":" + "BLE_PARING_DEMAND")}
        //                 toastBody={`"${hardName}" ${t(tns + ":" + "BLE_PAIRING_WHISH")}`}
        //                 buttons={buttons}
        //             />
        //         </View>
        //             )
        //       globalModal.setContent(content,{type:'centered'});    
        //       globalModal.toggle();
        //   }
        // //???????????????????????????????????????????????????????????


    const handleOnPressNextArrow = (deviceName) => {
        console.log('VAR :', deviceName);
        //onOpenSelect()
    }

    // const onPairPressed = () => {
    //     console.log('"HELLO_BLE_DEVICES_FOUND"');
    //     globalModal.close();
    //     navigation.navigate("BlePairingScreen")
    // }

    const mockBleList = [
        {id:"4856",name:"SAT-OPROLL"}, 
    ];


        let content = (
            <View style={{ backgroundColor: 'transparent', justifyContent: 'space-evenly', alignItems: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: '400', color: textColor, margin: 10, textAlign:'center' }} >{t(tns + ":" + "FOUND_EQUIPMENTS")}:</Text>
                {devices.map((device, index) => {
                        const deviceName = `${device.name} - ${(device.id).slice(0, 4)}`;
                        return(
                            <CardImageArrow
                                key={index}
                                onPressNextArrow={onNext}
                                withNextArrow={true}
                                imageSource={require('_brand/templates/screens/addObject/images/bleLogo.png')}
                                textDisplay={deviceName}
                                textStyle={{ marginRight: 20, backgroundColor:'transparent' }}
                                imgStyle={{ resizeMode: 'contain', height:40, backgroundColor:'transparent',  }}
                                label={"garageDoor"}
                            />
                        )
                    })
                } 

                <View style={{ width: '70%', marginTop: 20}}>
                        <MyButton onPress={handleEquipmentNotVisible} title={t(tns + ":" + "YOUR_EQUIPMENT_NOT_VISIBLE")} />
                </View>
                <View style={{ width: '100%', height:100}}/>
            </View>
        )



    return (
        <View>{content}</View>
        // <SafeAreaView>
        //     <View style={{ alignItems: 'center', justifyContent: 'flex-start', backgroundColor: bgcolor, paddingTop: 20 }}>
        //         {/* <HeaderScreen title={t(tns + ":" + "BLE_EQUIPMENTS")} goBack={() => navigation.navigate("AddObject")} /> */}
        //         <Body style={{ marginTop: 20, }}>
        //             <View>{content}</View>
        //         </Body>
        //     </View>
        // </SafeAreaView>

    )
};
