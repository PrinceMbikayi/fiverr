import '_brand/templates/screens/addObject/locales'
import React, { useEffect, useState, useRef } from 'react';
import { View, SafeAreaView, Text, Button, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useTheme } from '_theming/themeProvider';
import { Body } from '_brand/templates/screens/addObject/components/Body';
import { HeaderScreen } from '_brand/templates/screens/addObject/components/HeaderScreen';
import { CardImageWithArrow } from '_brand/templates/screens/addObject/components/addBoxComponents/CardImageWithArrow';
import { RenderGatewayCard } from '_brand/templates/screens/addObject/components/addBoxComponents/RenderGatewayCard';
import { useObject } from '_hooks/object';
import CalypshomeBox from "_brand/templates/screens/addObject/images/jsComponents/CalypshomeBox"
import { getObjectsByTypeName } from '_helpers/selectors';
import { myToast } from '_brand/templates/components/ui/myToast';
import {retrieveBoxDongles} from "_brand/templates/screens/addObject/utils/retrieveBoxDongles"
import {retrieveUserGateways} from "_brand/templates/screens/addObject/utils/retrieveUserGateways"
import { getObjectById } from '_helpers/objects';
import {useGlobalModal} from '_components/ui/globalModal'
import {GlobalToast} from '_brand/templates/components/objects/common/GlobalToast'






export const BoxChoice = (props) => {

    const {dongleType} = props
    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {};

    const { t, i18n } = useTranslation();
    const tns = "addObject";
    const globalModal = useGlobalModal(); 

    const { theme } = useTheme();
    const bgcolor = theme?.prflxbgColor || 'white';
    const textColor = theme?.prflxTextColor || 'black'

    const [message, setMessage] = useState("");

    useEffect(()=> {
        console.log('MESSAGE_CHANGED :', message);
    },[message]);

    // Get all gateways 
    const gateways = useSelector(state => getObjectsByTypeName(state, "Gateway")) || [];
    const userPhisicalGateways = retrieveUserGateways(gateways) || []

    const messageRef = useRef("Hello")

    const dongleIdentifierConfig = {
        "Zigbee_EZSP": "config_ext_pan_id",
        "Profalux": "present"
    }

    const handleGatewayChoice = (gateway) => {
        const status = gateway?.connected
        const gatewayObjectId = gateway?.id
        const gatewayGwId = gateway?.gw
        console.log('DATA_GATE :', status);

        if(!status){
            messageRef.current = t(tns + ":" + "BOX_DISCONNECTED")
            onOpenSelect()
        }else{

            // retrieve  dongle from selected gateway
            const components = gateway?.components || []
            const dongles =  retrieveBoxDongles(components, dongleType)
            const myBoxDongleId = dongles[0]

            //get the status of the dongle : box status can be connected but dongle not connected
            // This case can happen when the dongle is not connected to the box or in case of the box status is not updated
            const myDongleData = getObjectById(myBoxDongleId);
            const statusDictionary = myDongleData?.statusDictionary || {}
            console.log('MY_DONGLE_TYPE :', dongleType, myDongleData?.statusDictionary?.[dongleIdentifierConfig[dongleType]]);
            const dongleIdentifier = statusDictionary[dongleIdentifierConfig[dongleType]]


            let isdongle;
            if(dongleType == "Profalux"){
                const statusPresent = myDongleData?.objectDatas?.statusDictionary?.present || 0
                isdongle = (dongleIdentifier && dongleIdentifier == "1")? true : false
            }
            if(dongleType == "Zigbee_EZSP"){
                isdongle = (dongleIdentifier && dongleIdentifier != "-")? true : false
            }
            console.log('MY_DONGLE_DATA :', isdongle, myDongleData, "gateway :", gateway);

            if(!isdongle){
                // Navigate to add box to network
                switch(dongleType){
                    case "Zigbee_EZSP":
                        messageRef.current = t(tns + ":" + "ZIGBEE_DONGLE_DISCONNECTED")
                        const params = { "myBoxDongleId": myBoxDongleId,"gatewayObjectId": gatewayObjectId, "gatewayGwId": parseInt(gatewayGwId) }
                        navigation.navigate("AssociateBoxToNetworkInfoScreen", params)
                        break;
                    
                    case "Profalux":
                        messageRef.current = t(tns + ":" + "PROFALUX_DONGLE_DISCONNECTED")
                        const paramsProfalux = { "myBoxDongleId": myBoxDongleId,"gatewayObjectId": gatewayObjectId, "gatewayGwId": parseInt(gatewayGwId) }
                        navigation.navigate("AssociateBoxToNetworkInfoScreen", paramsProfalux)
                        break;
                }

            }

            if(isdongle){
                // navigate to add object assistant
                const params = { "myBoxDongleId": myBoxDongleId, "numberOfDongle": dongles.length, "gatewayObjectId": gatewayObjectId }
                navigation.navigate("ZigbeeAssistantHomeScreen", params)
            }
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
        console.log('CANCEL_DELETE :');
        globalModal.close();
      }
    
      const onOpenSelect = () => {  
          const content = (
            <View style={{width:275, backgroundColor:'transparent',alignSelf:'center',justifyContent:'center',alignItems:'center', borderRadius:14}}>
                <GlobalToast 
                    toastTitle={t(tns + ":" + "WARNING")}
                    toastBody={messageRef.current}
                    //toastBody={t(tns + ":" + "BOX_DISCONNECTED")}
                    buttons={buttons}
                />
            </View>
                )
          globalModal.setContent(content,{type:'centered'});    
          globalModal.toggle();
      }
    //?????????????
    /////////-------

    return (
        <View style={{justifyContent:'flex-start',alignItems:'flex-start', }}>
            <View style={{ backgroundColor: 'transparent', marginLeft:10, justifyContent: 'center', paddingHorizontal: 0, alignItems: 'center', marginVertical: 20 }}>
                <Text style={{ color: textColor, fontSize: 16, fontWeight: "400",}}>
                    {t(tns + ":" + "CHOOSE_CALYPSHOME_BOX_TO_ADD_EQUIPMENT")} :
                </Text>
            </View>
            <View>
            {userPhisicalGateways.map((id) => {
                const gatewayData = getObjectById(id)
                const connected = gatewayData?.connected
                const name = gatewayData?.name
                return (
                    <View style={{ padding:10 }}>
                        <RenderGatewayCard
                            key={id}
                            onPressNextArrow={() => handleGatewayChoice(gatewayData)}
                            ImageJs={CalypshomeBox}
                            sideText={name}
                            imgWidth={90}
                            withArrow={true}
                            isconnected={connected }
                            cardBgColor={"white"}
                        />
                    </View>
                )
            }
            )}
            </View>
        </View>
    )
}
