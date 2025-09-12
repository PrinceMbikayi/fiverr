import '_brand/templates/screens/addObject/locales'
import React, { useEffect, useRef } from 'react';
import { View, SafeAreaView, Text, Button } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation, Trans } from 'react-i18next';
import { useTheme } from '_theming/themeProvider';
import { Body } from '_brand/templates/screens/addObject/components/Body';
import { HeaderScreen } from '_brand/templates/screens/addObject/components/HeaderScreen';
import { CardImageArrow } from '_brand/templates/screens/addObject/components/addBoxComponents/CardImageArrow';
import { getAllObjects, getObjectsByTypeName, getObjectsVisible } from '_helpers/selectors';
import { Api } from "_api";
import { getObjectById } from '_helpers/objects';
import { MyButton } from '_brand/templates/components/ui/MyButton';
import { IndiceText } from '_brand/templates/components/objects/common/IndiceText';

export const AssociateBoxToNetworkInfoScreen = () => {


    const navigation = useNavigation(); 
    const route = useRoute();
    const params = route?.params || {};
    console.log('PARAMS :', params);

    const { t, i18n } = useTranslation();
    const tns = "addObject";

    const { theme } = useTheme();
    const bgcolor = theme?.prflxbgColor || 'white';
    const textColor = theme?.prflxTextColor || 'black'

    const boxName = getObjectById(params?.gatewayObjectId)?.name || `${t(tns + ":" + "EQUIP_ZIGBEE")}` ||"";
    
    const { myBoxDongleId, gatewayObjectId, gatewayGwId } = params;
    
    const goAssociateBox = () => {
        navigation.navigate("RemoteTypeChoiceScreen",params)
    }

    return (
        <SafeAreaView>
            <View style={{ alignItems: 'center', justifyContent: 'flex-start', backgroundColor: bgcolor, paddingTop: 20 }}>
                <HeaderScreen title={boxName} goBack={() => navigation.goBack()} />
                <Body style={{ marginTop: 40, }}>
                    <View style={{}}>
                        <Text style={{textAlign:'center', fontSize: 16, fontWeight:'400', color: textColor, marginBottom: 10 }}>
                            {t(tns + ":" + "BOX_IS_NOT_ASSOCIATED_TO_NETWORK")}
                            {/* <Trans i18nKey={tns + ":BOX_IS_NOT_ASSOCIATED_TO_NETWORK"}>
                                Votre
                                <IndiceText/> 
                                n'est actuellement pas\n associée à un réseau d'équipements\n CalypsHOME.
                            </Trans> */}
                        </Text>
                        <Text  style={{textAlign:'center', fontSize: 16, fontWeight:'400', color: textColor, marginBottom: 10 }}>
                            {t(tns + ":" + "ASSOCIATE_BOX_TO_NETWORK")}
                            {/* <Trans i18nKey={tns + ":ASSOCIATE_BOX_TO_NETWORK"}>
                                Nous allons associer votre
                                <IndiceText normalText="CalypsHOME" formattedText="Box" fontSize={16} />
                                à vos équipements CalypsHOME présents dans votre installation.
                            </Trans> */}
                        </Text>
                    </View>

                    <View style={{ minWidth: 200, marginTop: 200 }}>
                        <MyButton onPress={goAssociateBox} title={t(tns + ":" + "NEXT")} />
                    </View>
                </Body>
            </View>
        </SafeAreaView>

    )
};
