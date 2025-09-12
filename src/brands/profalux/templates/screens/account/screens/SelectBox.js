import '_brand/templates/screens/_locales'
import React from 'react';
import {useContext,useState,useEffect, useRef} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {useSelector,useDispatch} from "react-redux";
import { useTranslation } from 'react-i18next';
import { useNavigation,useRoute, useFocusEffect } from '@react-navigation/native';
import { useTheme} from '_theming/themeProvider'
import {BoxScreenTemplate} from "_brand/templates/screens/account/components/BoxScreenTemplate"
import {getObjectById} from '_helpers/objects';
import {RenderBox} from '_brand/templates/screens/account/components/RenderBox'
import { getObjectsByTypeName } from '_helpers/selectors';
import {retrieveUserGateways} from "_brand/templates/screens/addObject/utils/retrieveUserGateways"
import { RenderGatewayCard } from '_brand/templates/screens/addObject/components/addBoxComponents/RenderGatewayCard';
import CalypshomeBox from "_brand/templates/screens/addObject/images/jsComponents/CalypshomeBox"
import {retrieveBoxDongles} from "_brand/templates/screens/addObject/utils/retrieveBoxDongles"

export const SelectBox = (props) => {
    
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

    const handleGatewayChoice = (gateway) => {
      const boxId = gateway?.id
      navigation.navigate('ModifyBox', { boxId }); 
    }



      return (
        <BoxScreenTemplate withKebab={true} title={t("account:MY_CALYPSHOME_BOX")}  >
            <View>
            <Text style={styles.text}>{t("account:SELECT_BOX_TO_MODIFY")}</Text>
            </View>
            <View style={{marginTop:40}}>
            <View>
                {userPhisicalGateways.map((id, index)=>{
                    const gtwData =  getObjectById(id)
                    const gatewayData = getObjectById(id)
                    const connected = gatewayData?.connected
                    const name = gatewayData?.name
                    console.log("Gate way list to process :", gatewayData)

                    return(
                        <View style={{ padding:10, backgroundColor:'transparent'}}>
                            <RenderGatewayCard
                                key={id}
                                onPressNextArrow={() => handleGatewayChoice(gatewayData)}
                                ImageJs={CalypshomeBox}
                                sideText={name}
                                imgWidth={90}
                                withArrow={false}
                                isconnected={false }
                                cardBgColor={connected ? "white" : nonConnectedGray}
                                opacity={connected ? 1 : 0.5}
                            />
                        </View>
                    )
                })}

            </View>
            </View>
        </BoxScreenTemplate>
   
        )
};

const styles = StyleSheet.create({
  text: {
      marginTop:23,
      fontWeight:'400',
      fontSize: 16,
      textAlign:'center',
      color: '#3E495E'
  },
})




