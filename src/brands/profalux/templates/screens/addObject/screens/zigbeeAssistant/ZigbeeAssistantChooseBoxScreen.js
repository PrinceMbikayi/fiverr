import '_brand/templates/screens/addObject/locales'
import React, { useEffect, useRef } from 'react';
import { View, SafeAreaView, Text, Button, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import {Trans, useTranslation } from 'react-i18next';
import { useTheme } from '_theming/themeProvider';
import { Body } from '_brand/templates/screens/addObject/components/Body';
import { HeaderScreen } from '_brand/templates/screens/addObject/components/HeaderScreen';
import {RenderBoxItem} from "_brand/templates/screens/addObject/screens/solarAssistant/RenderBoxItem"
import { getObjectById } from '_helpers/objects';
import { getObjectsByTypeName } from '_helpers/selectors';
import {retrieveUserGateways} from "_brand/templates/screens/addObject/utils/retrieveUserGateways"
import { IndiceText } from '_brand/templates/components/objects/common/IndiceText';


export const ZigbeeAssistantChooseBoxScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {};
    console.log('NAVIGATION_PARAM :', navigationParams);

    const { theme } = useTheme();
    const bgcolor = theme?.prflxbgColor || 'white';
    const textColor = theme?.prflxTextColor || 'black'

    const { t, i18n } = useTranslation();
    const tns = "addObject";

    // Get all gateways 
    const gateways = useSelector(state => getObjectsByTypeName(state, "Gateway")) || [];
    const userPhisicalGateways = retrieveUserGateways(gateways) || []

    const handleBoxChoice = (item) => {
        console.log('ITEMMM :', item);
    }

    return (
        <SafeAreaView>
            <View style={{ alignItems: 'center', justifyContent: 'flex-start', backgroundColor: bgcolor, paddingTop: 20 }}>
                <HeaderScreen title={t(tns + ":" + "SELECT_CALYPSHOME_BOX")} goBack={() => navigation.navigate("AddObject")} />
                <Body style={{ marginTop: 20, }}>
                    <ScrollView>
                            {/* <BoxChoice 
                                dongleType={"Zigbee_EZSP"} 
                                destination ={"ZigbeeAssistantHomeScreen"} 
                                isProfalux868 ={false}
                            /> */}

                            <View >
                                <Text style={{ color: textColor, fontSize: 16, fontWeight: '400', textAlign: 'center', marginBottom: 20 }}>
                                    {t(tns + ":" + "CHOOSE_BOX_FOR_ASSISTANT")}
                                    {/* <Trans i18nKey={tns + ":CHOOSE_BOX_FOR_ASSISTANT"}>
                                        Sélectionner sur quelle 
                                        <IndiceText normalText="CalypsHOME" formattedText="Box" fontSize={16} /> 
                                        vous souhaitez ajouter l'équipement :
                                    </Trans> */}
                                </Text>
                            </View>

                            <View> 
                                { 
                                    userPhisicalGateways.map((boxId,idx)=>(
                                            <RenderBoxItem 
                                                boxId={boxId}
                                                key={idx} 
                                                dongleType={"Zigbee_EZSP"}
                                                //handleBoxChoice={handleBoxChoice}
                                            />
                                    ))
                                }
                            </View>
                        <View style={{ width: 200, height: 40 }}></View>
                    </ScrollView>
                </Body>
            </View>
        </SafeAreaView>

    )
};
