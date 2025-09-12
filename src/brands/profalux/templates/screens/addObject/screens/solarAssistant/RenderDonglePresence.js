import '_brand/templates/screens/addObject/locales'
import React, { useEffect, useRef } from 'react';
import { View, SafeAreaView, Text, Button, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useTheme } from '_theming/themeProvider';
import { Body } from '_brand/templates/screens/addObject/components/Body';
import { HeaderScreen } from '_brand/templates/screens/addObject/components/HeaderScreen';
import { BoxChoice } from "_brand/templates/screens/addObject/components/BoxChoice"
import { CardImageWithArrow } from '_brand/templates/screens/addObject/components/addBoxComponents/CardImageWithArrow';
import { RenderGatewayCard } from '_brand/templates/screens/addObject/components/addBoxComponents/RenderGatewayCard';
import { useObject } from '_hooks/object';
import CalypshomeBox from "_brand/templates/screens/addObject/images/jsComponents/CalypshomeBox"
import { Api } from "_api";
import { myToast } from '_brand/templates/components/ui/myToast';
import { getObjectById } from '_helpers/objects';
import { getObjectsByTypeName } from '_helpers/selectors';
import {retrieveBoxDongles} from "_brand/templates/screens/addObject/utils/retrieveBoxDongles"
import {useGlobalModal} from '_components/ui/globalModal'
import {GlobalToast} from '_brand/templates/components/objects/common/GlobalToast'


export const RenderDonglePresence = (props) => {
    const { dongleId, boxId, handleBoxChoice, dongleType} = props

    const navigation = useNavigation();
    const { t, i18n } = useTranslation();
    const tns = "addObject";
    const { theme } = useTheme();
    const nonConnectedGray = "white"||theme?.prflxNonConnectedGray || '#CCC'
    const messageRef = useRef("Hello")
    const globalModal = useGlobalModal(); 

    const uDongle = useObject(dongleId)
    
    const gateway = useObject(boxId)
    const boxName = gateway?.name
    const isBoxconnected = gateway?.connected
    const gatewayGwId = gateway?.objectDatas?.gw

    const dongleIdentifierConfig = {
        "Zigbee_EZSP": "config_ext_pan_id",
        "Profalux": "present"
    }

    const present = uDongle?.statuses?.["present"]

    console.log('PRESENT_EXIST :',dongleType, present);

    let dongleIdentifier = dongleIdentifierConfig[dongleType] || "present"
    const statuses = uDongle?.objectDatas?.statusDictionary
    const identifierStatus = statuses?.[dongleIdentifier]
    let isdongleConfigured;
    console.log('DONGLE_STATUS :',dongleType, identifierStatus,uDongle);
    let addDongleText;

    
    if(dongleType == "Profalux"){
        isdongleConfigured = (identifierStatus && identifierStatus == "1")? true : false
        console.log('IS_ROX_PRESENT :',identifierStatus,  isdongleConfigured);
        if(isBoxconnected){
            addDongleText = (dongleId && dongleId != "-1") ? "" :t(tns + ":" + "ADD_DONGLE_TEXT")
        }else{
            addDongleText = ""
        }
    }

    if(dongleType == "Zigbee_EZSP"){
        let presentFlag = present ? true : false
        console.log('PRESENT_FLAG :',presentFlag);

        if(statuses == undefined){
            isdongleConfigured = "-1"
            console.log('DONGLE_NOT_CONFIGURED :', statuses);
        }else{
            // statuses is present 
            // Now check if config_ext_pan_id is present 
            if(identifierStatus == undefined){
                isdongleConfigured = "-1" // Force restart box
            }else{
                isdongleConfigured = identifierStatus != "-" ? true : false
            }
            
            
        }
    }

    console.log('HAR :',identifierStatus, isdongleConfigured, statuses);

    useEffect(() => {
       //console.log('WATCH_DONGLE_IDENTIFIER_STATUS :', identifierStatus);
    }, [identifierStatus]);

    const cardColorConfig = {
        "Zigbee_EZSP":"white" ,
        "Profalux": isdongleConfigured ? "white": nonConnectedGray
    }

    const move = (destination)=>{
        console.log('HANDLE_PRESS_NEXT :', dongleId);
        const params = { "myBoxDongleId": dongleId,"gatewayObjectId": boxId, "gatewayGwId": parseInt(gatewayGwId), "numberOfDongle": 1 }
        if(destination == "noMove"){
            //if  dongleId = -1 : direct to add 868 dongle screen
            if(dongleId == "-1" || dongleId == -1){
                 navigation.navigate('ConnectSolarDongleScreen',{boxId:boxId})
            }else{
                // Test with status "present=0" : Dongle disconnected
                // "present=1": Box present and well configured
                // "present=undefined":Not likelly to arise since by default when no Dongle is register, we set "dongleId=-1"
                //                     However let define a default message : popup "Unplug and plug the Dongle"
                
                 messageRef.current = identifierStatus ==0 ? t(tns + ":" + "ROX_DONGLE_DISCONNECTED") : t(tns + ":" + "UNPLUGGED_PLUGGED_DONGLE")
                onOpenSelect()
            }
        }else{
            navigation.navigate(destination, params)
        }
    }
    const destinationConfig = {
        "Zigbee_EZSP": isdongleConfigured ? "ZigbeeAssistantHomeScreen" : "AssociateBoxToNetworkInfoScreen",
        "Profalux": isdongleConfigured ? "SolarAssistantProcess" : "noMove"
    }


    const handlePressNextZigbee = () => {
        
        if(!isBoxconnected){
            messageRef.current = t(tns + ":" + "BOX_DISCONNECTED")
            onOpenSelect()
        }
        
        if(isBoxconnected){
            if(isdongleConfigured =="-1"){
                messageRef.current = t(tns + ":" + "RESTART_BOX")
                const restartButton = [
                    {
                        id:"return",
                        text:`${t(tns + ":" + "RESTART_POWER")}`,
                        action:()=>onRestartPressed(),
                        textColor:"#007AFF"
                    }
                ]
                onOpenSelect(restartButton)
            }else{
                move(destinationConfig[dongleType])
            }
        }

    }
    const handlePressNext = () => {
        console.log('IS_BOX_CONNECTED :', isBoxconnected, isdongleConfigured, dongleId);
        if(!isBoxconnected){
            // If Dongle exists but not fully configured : Ask user to unplug and replug it
            //messageRef.current = (dongleId && dongleId != -1) ? t(tns + ":" + "UNPLUGGED_PLUGGED_BOX") : t(tns + ":" + "BOX_DISCONNECTED")
            messageRef.current = t(tns + ":" + "BOX_DISCONNECTED")
            onOpenSelect()
        }
        
        if(isBoxconnected){
            move(destinationConfig[dongleType])
        }

    }

    //////////-------
    const buttons = [
        {
            id:"return",
            text:`${t(tns + ":" + "RETURN")}`,
            action:()=>onCancelPressed(),
            textColor:"#007AFF"
        }
    ]

    const onCancelPressed = () => {
        navigation.navigate("AddObject")
        globalModal.close();
    }

    const onRestartPressed = async() => {
        console.log('RESTART_BOX : Hello Hardy', boxId);
        const response = await Api.fireRestartCommandOnGateway(boxId).catch((err) => console.log(err));
        //console.log('RESTART_BOX :', response);
        globalModal.close();
        }
    
        const onOpenSelect = (myButtons) => {  
            const content = (
            <View style={{width:275, backgroundColor:'transparent',alignSelf:'center',justifyContent:'center',alignItems:'center', borderRadius:14}}>
                <GlobalToast 
                    toastTitle={t(tns + ":" + "WARNING")}
                    toastBody={messageRef.current}
                    buttons={myButtons|| buttons}
                />
            </View>
                )
            globalModal.setContent(content,{type:'centered'});    
            globalModal.toggle();
        }
        /////////-------

    let content = (
        <View style={{ paddingHorizontal: 10, backgroundColor: 'transparent' }} >
            {dongleType == "Zigbee_EZSP" &&
                <RenderGatewayCard
                    onPressNextArrow={handlePressNextZigbee}
                    id={boxId}
                    ImageJs={CalypshomeBox}
                    sideText={boxName}
                    imgWidth={90}
                    withArrow={true}
                    cardBgColor={isBoxconnected ? cardColorConfig[dongleType] : nonConnectedGray}
                    disabled={false}
                    addDongleText={""}
                    dongleId={dongleId}
                />
            }
            {dongleType == "Profalux" &&
                <RenderGatewayCard
                    onPressNextArrow={handlePressNext}
                    id={boxId}
                    ImageJs={CalypshomeBox}
                    sideText={boxName}
                    imgWidth={90}
                    withArrow={true}
                    cardBgColor={isBoxconnected ? cardColorConfig[dongleType] : nonConnectedGray}
                    opacity={isdongleConfigured ? 1 : 0.5}
                    disabled={false}
                    addDongleText={addDongleText}
                    dongleId={dongleId}
                />
            }
        </View>
    )


    return (
        <View>
            {content}
        </View>
    )

}