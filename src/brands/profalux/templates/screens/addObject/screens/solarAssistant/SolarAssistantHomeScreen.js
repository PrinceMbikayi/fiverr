import '_brand/templates/screens/addObject/locales'
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import PagerView from 'react-native-pager-view';
import { useTheme } from '_theming/themeProvider';
import { ChoixDongleRadio868 } from '_brand/templates/screens/addObject/components/ChoixDongleRadio868';
import { InstructionBranchDongle } from '_brand/templates/screens/addObject/components/InstructionBranchDongle';
import { UserObjectTypeChoice } from '_brand/templates/screens/addObject/components/UserObjectTypeChoice';
import Button from '_brand/templates/components/ui/Button';
import { Body } from '_brand/templates/screens/addObject/components/Body';
import { LoadingAnimation } from '_brand/templates/screens/addObject/components/LoadingAnimation';
import { AddObjectCountDownTasks } from '_brand/templates/screens/addObject/components/AddObjectCountDownTasks';
import { TestObjectBeforeAdding } from '_brand/templates/screens/addObject/components/TestObjectBeforeAdding';
import { ModifyNewAddedObject } from '_brand/templates/screens/addObject/components/ModifyNewAddedObject';
import { HeaderScreen } from '_brand/templates/screens/addObject/components/HeaderScreen';
import { CardImageArrow } from '_brand/templates/screens/addObject/components/addBoxComponents/CardImageArrow';

import Toast from 'react-native-root-toast';
import { myToast } from '_brand/templates/components/ui/myToast';
import { getObjectsByTypeName } from '_helpers/selectors';
import { getObjectById } from '_helpers/objects';
import { Api } from "_api";
import * as Actions from '_actions/objects';
import { deleteObject } from '_api/objects';
import {retrieveUserGateways} from "_brand/templates/screens/addObject/utils/retrieveUserGateways"
import { useObject } from '_hooks/object';
import {RenderBoxItem} from "_brand/templates/screens/addObject/screens/solarAssistant/RenderBoxItem"
import {difference as lodashDifference, pull as lodashPull} from 'lodash';
import { RenderGatewayCard } from '_brand/templates/screens/addObject/components/addBoxComponents/RenderGatewayCard';
import CalypshomeBox from "_brand/templates/screens/addObject/images/jsComponents/CalypshomeBox"

export const SolarAssistantHomeScreen = () => {

    const navigation = useNavigation();
    const { t, i18n } = useTranslation();
    const tns = "addObject";
    const route = useRoute();
    const navigationParams = route?.params || {};

    const { theme } = useTheme();
    const bgcolor = theme?.prflxbgColor || 'white';
    const textColor = theme?.prflxTextColor || 'black'
    console.log('SOLAR_DONGLE :', navigationParams);


    const gateways = useSelector(state => getObjectsByTypeName(state, "Gateway"));
    const myGateways = retrieveUserGateways(gateways)||[]
    const gatewaysRef = useRef(JSON.stringify(myGateways))

    console.log('USER_GATEWAYS :', JSON.stringify(myGateways), gatewaysRef.current);

    const [userGateways, setUserGateways] = useState(myGateways);
    const [showAddNewBoxCard, setShowAddNewBoxCard] = useState(false);
    
    useEffect(()=> {
        const newComer = lodashDifference(JSON.stringify(myGateways), gatewaysRef.current)
        console.log('showAddNewBoxCard :',newComer, showAddNewBoxCard);
        if(newComer.length != 0){
            setShowAddNewBoxCard(true)
            setUserGateways(myGateways)
        }
    },[gateways]);

    useEffect(()=> {
    
    },[userGateways]);

    useEffect(()=> {
    
    },[showAddNewBoxCard]);


    const handleBoxChoice = (object)=>{
        const {boxId, dongleId,destination} = object
        console.log('Hello :', object);
        //navigation.navigate(destination, object)
    }

    const handleAddNewDongleToBox = ()=>{
        navigation.navigate('ConnectSolarDongleScreen')
    }


    return(
        <SafeAreaView>
        <View style={{ alignItems: 'center', justifyContent: 'flex-start', backgroundColor: bgcolor, paddingTop: 20 }}>
            <HeaderScreen title={t(tns + ":" + "SELECT_CALYPSHOME_BOX")} goBack={() => navigation.navigate("AddObject")} />
                <Body>
                    <View style={{backgroundColor:'transparent',justifyContent:'center',paddingHorizontal:5, alignItems:'center',marginVertical:20}}>
                        <Text style={{color:textColor,textAlign:'center', fontSize:15, fontWeight:"400"}}>
                            {t(tns + ":" + "CHOOSE_CALYPSHOME_BOX_TO_ADD_EQUIPMENT")}
                        </Text>
                    </View>
                    <View> 
                        { userGateways &&
                            userGateways.map((boxId,idx)=>(
                                    <RenderBoxItem 
                                        boxId={boxId} 
                                        key={idx} 
                                        dongleType={"Profalux"} 
                                        //handleBoxChoice={handleBoxChoice}
                                    />
                            ))
                        }
                    </View>
                </Body>
        </View>
    </SafeAreaView>
    )
}