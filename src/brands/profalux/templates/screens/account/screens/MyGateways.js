import '_brand/templates/screens/_locales'
import React, {useEffect} from 'react';
import {View} from 'react-native';
import {useSelector,useDispatch} from "react-redux";
import { useTranslation } from 'react-i18next';
import { useNavigation,useRoute } from '@react-navigation/native';
import { useTheme} from '_theming/themeProvider'
import {BoxScreenTemplate} from "_brand/templates/screens/account/components/BoxScreenTemplate"
import {getObjectById} from '_helpers/objects';
import { getObjectsByTypeName } from '_helpers/selectors';
import {retrieveUserGateways} from "_brand/templates/screens/addObject/utils/retrieveUserGateways"
import { GatewayCard } from '../components/GatewayCard';
import CalypshomeBox from "_brand/templates/screens/addObject/images/jsComponents/CalypshomeBox"
import {retrieveBoxDongles} from "_brand/templates/screens/addObject/utils/retrieveBoxDongles"

export const MyGateways = (props) => {
    
    const { t, i18n } = useTranslation();
    const {theme } = useTheme();
    const dispatch = useDispatch();
    
    const navigation = useNavigation();
    const route = useRoute();
    const navParams = route?.params || {}; 

    const nonConnectedGray = theme?.prflxNonConnectedGray || '#CCC'


    // Get User gateways 
    const gateways = useSelector(state => getObjectsByTypeName(state, "Gateway")) || [];
    const userPhisicalGateways = retrieveUserGateways(gateways) || []

    useEffect(()=> {
    },[gateways]);

    const handleGatewayChoice = (gateway) => {
        console.log('GATEWAY_CHOICE :', gateway);
        const components = gateway?.components || []
        const zigbeeDongles =  retrieveBoxDongles(components, "Zigbee_EZSP") || []
        const solarDongles =  retrieveBoxDongles(components, "Profalux") || []
        const solarDongleId = solarDongles[0] ? parseInt(solarDongles[0]) : -1
        const zigbeeDongleId = zigbeeDongles[0] ? parseInt(zigbeeDongles[0]) : -1
        

        let params = {
                gatewayId:gateway?.id, 
                gatewayGwId:parseInt(gateway?.gw),
                zigbeeDongleId:zigbeeDongleId, 
                solarDongleId:solarDongleId,
            }
        navigation.navigate('GatewayDetails', params)
        
    }

    return (
    <BoxScreenTemplate withKebab={true} title={t("account:MY_CALYPSHOME_BOX")}  >
        {/* <View>
        <Text style={styles.text}>{t("account:HERE_FIND_ALL_CALYPSHOME_BOX_INFOS")}</Text>
        </View> */}
        <View style={{marginTop:40}}>
        <View>
            {userPhisicalGateways.map((id, index)=>{
                const gatewayData = getObjectById(id)

                return(
                    <View style={{ padding:10, backgroundColor:'transparent'}}>
                        <GatewayCard
                            key={id}
                            itemId={id}
                            onPressNextArrow={() => handleGatewayChoice(gatewayData)}
                            ImageJs={CalypshomeBox}
                            imgWidth={90}
                            withArrow={true}
                        />
                    </View>
                )
            })}

        </View>
        </View>
    </BoxScreenTemplate>

    )
};