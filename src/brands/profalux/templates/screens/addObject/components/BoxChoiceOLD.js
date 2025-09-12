import '_brand/templates/screens/addObject/locales'
import React, { useEffect, useRef, useState } from 'react';
import { View, SafeAreaView, Text, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useTheme } from '_theming/themeProvider';
import { Body } from '_brand/templates/screens/addObject/components/Body';
import { HeaderScreen } from '_brand/templates/screens/addObject/components/HeaderScreen';
import { CardImageArrow } from '_brand/templates/screens/addObject/components/addBoxComponents/CardImageArrow';
import { getObjectsByTypeName } from '_helpers/selectors';
import { Api } from "_api";
import { getObjectById } from '_helpers/objects';
import { CardImageWithArrow } from '_brand/templates/screens/addObject/components/addBoxComponents/CardImageWithArrow';
import CalypshomeBox from "_brand/templates/screens/addObject/images/jsComponents/CalypshomeBox"
import Button from '_brand/templates/components/ui/Button';
import { RenderGatewayCard } from '_brand/templates/screens/addObject/components/addBoxComponents/RenderGatewayCard';
import { RenderGatewayPresence } from './RenderGatewayPresence';



export const BoxChoiceOLD = (props) => {

    const { whichDongle, destination, isProfalux868 } = props

    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {};

    const { t, i18n } = useTranslation();
    const tns = "addObject";

    const { theme } = useTheme();
    const bgcolor = theme?.prflxbgColor || 'white';
    const textColor = theme?.prflxTextColor || 'black'



    const dongles = useSelector(state => getObjectsByTypeName(state, whichDongle));

    // Get all gateways 
    const gateways = useSelector(state => getObjectsByTypeName(state, "Gateway")) || [];
    gatewayListRef = useRef([])
    gatewayGwIdsWithDonglesRef = useRef([])


    useEffect(() => {
        console.log("DONGLE LIST XXX:", dongles)
    }, [dongles])





    const myDongleList = useSelector(state => getObjectsByTypeName(state, whichDongle)) || [];
    const dongleListLength = myDongleList?.length

    let myGatewaysGW = []
    let idString
    myDongleList.map((idDongle) => {
        const getDongle = getObjectById(idDongle)
        console.log('Haaa :', getDongle);
        idString = getDongle?.gw
        myGatewaysGW.push(idString)
    })
    gatewayGwIdsWithDonglesRef.current = [...myGatewaysGW]


    gatewayListRef.current = gateways.reduce((accumulator, gtw) => {
        const gtwData = getObjectById(gtw) || {}
        const realName = gtwData?.realName || ''
        console.log(" GATE WAY DATA ZIG :", gtwData)

        if ((gtwData?.realName != 'System' &&
            gtwData?.realName != "ABox" &&
            realName.slice(0, 10) != 'WebBrowser' &&
            realName.slice(0, 10) != '' &&
            (gtwData?.realName).length == 24)
        ) {
            accumulator.push(gtwData?.id)
        }
        return accumulator;
    }, [])

    const handleGatewayChoice = (gwObjectId, gwId) => {
        console.log("THIS_WHAT_I_CHOSE :", gwObjectId, gwId)
        let myBoxDongleId;
        myDongleList.map((idDongle) => {
            const getDongle = getObjectById(idDongle)
            const dongleGatewayAssociated = getDongle?.gw
            if (gwId == dongleGatewayAssociated) {
                myBoxDongleId = idDongle
            }
        })
        console.log("THIS_WHAT_I_CHOSE_DONGLE :", myBoxDongleId)
        const params = { "myBoxDongleId": myBoxDongleId, "numberOfDongle": dongleListLength, "gatewayObjectId": gwObjectId }
        navigation.navigate(destination, params)
    }


    const nbBoxWithDongles = gatewayGwIdsWithDonglesRef.current

    const RenderNoBoxWithDongle = () => {

        return (
            <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent', paddingHorizontal: 10, paddingTop: 50 }} >
                <Text style={{ color: textColor, fontSize: 16, fontWeight: "400" }} >
                    {t(tns + ":" + "NO_BOX_WITH_ROX_DONGLE")}
                </Text>
                <View style={{ color: textColor, width: 200, height: 50, alignSelf: 'center', marginTop: 100 }}>
                    <Button onPress={() => navigation.goBack()} altStyle titleColor='white' title={t(tns + ":" + "RETURN")} bgColor={textColor} noBorder />
                </View>
            </View>
        )
    }

    const hasDongleRef = useRef(false)


    return (
        <View>
            {nbBoxWithDongles.length != 0 ?
                <View>
                    <View style={{ backgroundColor: 'transparent', justifyContent: 'center', paddingHorizontal: 5, alignItems: 'center', marginBottom: 30 }}>
                        <Text style={{ color: textColor, fontSize: 15, fontWeight: "400" }}>
                            {t(tns + ":" + "CHOOSE_CALYPSHOME_BOX_TO_ADD_EQUIPMENT")}
                        </Text>
                    </View>

                    {
                        gatewayListRef.current.map((id, index) => {
                            const gatewayObject = getObjectById(id)
                            const gw = gatewayObject?.gw
                            const list = gatewayGwIdsWithDonglesRef.current
                            const hasDongle = list.includes(gw)
                            //setHasDongle(hasDongle)
                            hasDongleRef.current = hasDongle
                            console.log("GATEWAY_NAME :", gatewayObject, hasDongleRef.current)
                            const name = gatewayObject?.name
                            const connected = gatewayObject?.connected
                            return (
                                <View style={{ paddingVertical: 5, paddingHorizontal: 10 }} key={index} >
                                    {hasDongle ?
                                        <View>
                                            <RenderGatewayPresence boxId={id} handleGatewayChoice={() => handleGatewayChoice(id, gw)} hasZigbeeDongle={hasDongleRef.current} />
                                        </View>
                                        :
                                        <View>
                                            <RenderGatewayPresence boxId={id} handleGatewayChoice={() => handleGatewayChoice(id, gw)} hasZigbeeDongle={hasDongleRef.current} />
                                        </View>

                                    }
                                </View>
                            )
                        })}
                </View>
                :
                <View>
                    <RenderNoBoxWithDongle />
                </View>
            }

        </View>
    )
};
