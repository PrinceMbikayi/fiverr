import '_brand/templates/screens/addObject/locales'
import React, { useEffect, useRef } from 'react';
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

export const ZigbeeAssistantHomeScreen = () => {


    const navigation = useNavigation();
    const route = useRoute();
    const params = route?.params || {};
    const {gatewayObjectId, myBoxDongleId, numberOfDongle } = params;
    console.log("NB_DONGLE :", gatewayObjectId, myBoxDongleId, numberOfDongle)

    const { t, i18n } = useTranslation();
    const tns = "addObject";

    const { theme } = useTheme();
    const bgcolor = theme?.prflxbgColor || 'white';
    const textColor = theme?.prflxTextColor || 'black'


    const goAddSensor = async () => {
        const actionRequest = await Api.executeAction(myBoxDongleId, "APPAIRAGE", { oArgs: [{ name: 'duration', value: 2 }] })
        console.log("Open network :", actionRequest)

        navigation.navigate("CalypsHomeSensorsScreen")
    }

    const sendStopCarto = async (id) => {
        const commandName = "stop"
        const resStopCarto = await Api.fireDiscoverCommandOnGateway(id, commandName).catch((err) => console.log(err));
        console.log("RESULT_STOP_CARTO :", resStopCarto)
        return resStopCarto
    }


    const handleOnPressNextArrow = (label) => {
        console.log('GO_TO_LABEL :', label);
        if (gatewayObjectId) {
            sendStopCarto(gatewayObjectId)
        }

        switch (label) {
            case "portable":
                navigation.navigate("AddShuttersProcessScreen", { "myBoxDongleId": myBoxDongleId, "remoteType": "portable" })
                break
            case "wall":
                navigation.navigate("AddShuttersProcessScreen", { "myBoxDongleId": myBoxDongleId, "remoteType": "wall" })
                break
            // case "portable":
            //     navigation.navigate("PortableRemoteEquipmentsScreen", { "myBoxDongleId": myBoxDongleId })
            //     break
            // case "wall":
            //     navigation.navigate("WallRemoteEquipmentsScreen", { "myBoxDongleId": myBoxDongleId })
            //     break
            case "receptor":
                navigation.navigate("ZigbeeReceptorEquipmentsScreen", { "myBoxDongleId": myBoxDongleId })
                break
            case "sensor":
                goAddSensor()
                break
            default:
                console.log('No default choice');

        }



    }



    let content;
    if (numberOfDongle != 0) {
        content =
            <View style={{ backgroundColor: 'transparent' }}>
                <Text style={{ fontSize: 16, fontWeight: '400', color: textColor, margin: 10, textAlign:'center' }} >{t(tns + ":" + "EQUIP_TYPE_CHOICE")}:</Text>
                <CardImageArrow
                    onPressNextArrow={handleOnPressNextArrow}
                    withNextArrow={true}
                    imageSource={require('_brand/templates/screens/addObject/images/simpleRemote.png')}
                    textDisplay={t(tns + ":" + "EQUIP_PORTABLE_REMOTE")}
                    textStyle={{ marginRight: 40 }}
                    imgStyle={{ width: 60, height: 80 }}
                    label={"portable"}
                />
                <CardImageArrow
                    onPressNextArrow={handleOnPressNextArrow}
                    withNextArrow={true}
                    imageSource={require('_brand/templates/screens/addObject/images/wallRemote.png')}
                    textDisplay={t(tns + ":" + "EQUIP_WALL_REMOTE")}
                    textStyle={{ marginRight: 40 }}
                    imgStyle={{ width: 60, height: 80 }}
                    label={"wall"}
                />
                <CardImageArrow 
                    onPressNextArrow = {handleOnPressNextArrow}
                    withNextArrow = {true}
                    imageSource = {require('_brand/templates/screens/addObject/images/profaluxCap.png')}
                    textDisplay = {t(tns + ":" + "EQUIP_CALYPS_SENSOR")}
                    textStyle={{marginRight:50}}
                    imgStyle={{width:60, height:80}}
                    label = {"sensor"}
                />
                <CardImageArrow
                    onPressNextArrow={handleOnPressNextArrow}
                    withNextArrow={true}
                    imageSource={require('_brand/templates/screens/addObject/images/receptor.png')}
                    textDisplay={t(tns + ":" + "EQUIP_ZIGBEE_RECEPTOR")}
                    textStyle={{ marginRight: 40 }}
                    imgStyle={{ width: 70, height: 80 }}
                    label={"receptor"}
                />
            </View>
    } else {
        content =
            <View style={{ marginTop: 50 }}>
                <Text style={{ fontSize: 16, fontWeight: '400', color: textColor }}>{t(tns + ":" + "NO_ZIGBEE_DONGLE")}</Text>
                <View style={{ backgroundColor: textColor, padding: 0, minWidth: 200, borderRadius: 14, marginTop: 250 }}>
                    <Button onPress={() => navigation.navigate("AddObject")} color='white' title={t(tns + ":" + "RETURN")} />
                </View>
            </View>
    }

    return (
        <SafeAreaView>
            <View style={{ alignItems: 'center', justifyContent: 'flex-start', backgroundColor: bgcolor, paddingTop: 20 }}>
                <HeaderScreen title={t(tns + ":" + "EQUIP_ZIGBEE")} goBack={() => navigation.navigate("AddObject")} />
                <Body style={{ marginTop: 20, }}>
                    <View>{content}</View>
                </Body>
            </View>
        </SafeAreaView>

    )
};
