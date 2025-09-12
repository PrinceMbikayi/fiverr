import '_brand/templates/screens/addObject/locales'
import React, { useEffect, useState, useRef } from 'react';
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
import { getObjectsByTypeName } from '_helpers/selectors';
import { myToast } from '_brand/templates/components/ui/myToast';
import {retrieveBoxDongles} from "_brand/templates/screens/addObject/utils/retrieveUserGateways"








export const RenderGatewayPresence = (props) => {

    const { boxId, handleGatewayChoice, hasZigbeeDongle } = props

    const uObject = useObject(boxId)
    const name = uObject?.name
    const connected = uObject?.connected

    const navigation = useNavigation();
    const { t, i18n } = useTranslation();
    const tns = "addObject";

    const { theme } = useTheme();
    const nonConnectedGray = theme?.prflxNonConnectedGray || '#CCC'

    console.log("CHECK_IF_ZIGBEE_DONGLE_PRESENT :", boxId, hasZigbeeDongle)

    useEffect(() => {
        console.log('TTTT :', connected);
    }, [connected]);

    const handleWarning = () => {
        console.log('SHOW_WARNING :', hasZigbeeDongle);
        //let disabledFlag = (statusPresent == 1 && isBoxconnected) ? false : (dongleId == -1 ? false : true)
        let message;
        //console.log('DISABLED_FLAG :', disabledFlag, isBoxconnected);


        if (connected) {
            if (hasZigbeeDongle == false) {
                message = `${t(tns + ":" + "ZIGBEE_DONGLE_DISCONNECTED")}`
            }
        } else {
            if (hasZigbeeDongle == false) {
                message = `${t(tns + ":" + "ADD_BOX_TO_NETWORK")}`
            } else {
                message = `${t(tns + ":" + "BOX_DISCONNECTED")}`
            }
        }
        myToast(message)
    }


    return (
        <View>
            <RenderGatewayCard
                onPressNextArrow={handleGatewayChoice}
                handleWarning={handleWarning}
                id={boxId}
                ImageJs={CalypshomeBox}
                sideText={name}
                imgWidth={90}
                withArrow={true}
                cardBgColor={connected ? "white" : 'nonConnectedGray'}
                disabled={connected ? false : true}
                hasZigbeeDongle={hasZigbeeDongle}
            // cardBgColor={carColor}
            // disabled={disabledFlag}
            //addDongleText={t(tns + ":" + "NO_ZIGBEE_DONGLE_DETEDTED")}
            //dongleId={dongleId}
            />
        </View>
    )
}