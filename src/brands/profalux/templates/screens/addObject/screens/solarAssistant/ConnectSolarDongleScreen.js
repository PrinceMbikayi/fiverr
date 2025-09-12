import '_brand/templates/screens/addObject/locales'
import React, { useEffect,useState, useRef } from 'react';
import { View, SafeAreaView, Text, ScrollView, StyleSheet} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector, useDispatch, useStore } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useTheme } from '_theming/themeProvider';
import { Body } from '_brand/templates/screens/addObject/components/Body';
import { HeaderScreen } from '_brand/templates/screens/addObject/components/HeaderScreen';
import {BoxChoice} from "_brand/templates/screens/addObject/components/BoxChoice"
import { LoadingAnimation } from '_brand/templates/screens/addObject/components/LoadingAnimation';
import { InstructionBranchDongle } from '_brand/templates/screens/addObject/components/InstructionBranchDongle';
import { getObjectById } from '_helpers/objects';
import { getObjectsByTypeName } from '_helpers/selectors';
import Button from '_brand/templates/components/ui/Button';
import {difference as lodashDifference, pull as lodashPull} from 'lodash';
import { myToast } from '_brand/templates/components/ui/myToast';
import { refreshObjectAction } from '_actions/asyncActions';


export const ConnectSolarDongleScreen = () => {

    const store = useStore();
    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {};
    const {boxId} =navigationParams 
    console.log('NAV_PARAMS_G :', boxId);

    const { t, i18n } = useTranslation();
    const tns = "addObject";

    const { theme } = useTheme();
    const bgcolor = theme?.prflxbgColor || 'white';
    const textColor = theme?.prflxTextColor || 'black'



    const dongleList = useSelector(state => getObjectsByTypeName(state, "Profalux"));
    const initialDongleListRef = useRef(dongleList)
    //const initialDongleListRef = useRef(JSON.stringify(dongleList))
    let timerRef = useRef(null)

    const [loading, setLoading] = useState(false);
    const [isNewDongle, setIsNewDongle] = useState(false);


    useEffect(()=> {
    
    },[loading]);

    useEffect(()=> {
        console.log('DIFF_NEW :', isNewDongle);
    },[isNewDongle]);

    useEffect(()=> {
        console.log('DONGLE_LIST_CHANGED:', dongleList, initialDongleListRef.current);
        // const test1 = [1,2,3]
        // const test2 = [1,2,3,4]// lodashDifference(test2, test1) = ["22"]
        const newComer = lodashDifference(dongleList, initialDongleListRef.current)
        //console.log('DIFF :', dongleList, initialDongleListRef.current );
        console.log('DIFF_INIT :', initialDongleListRef.current );
        console.log('DIFF_FINAL :', dongleList);
        console.log('DIFF_NEW :', newComer, );

        if(newComer.length != 0){
            setIsNewDongle(true)
        }else{
            setIsNewDongle(false)
        }

    },[dongleList]);

    const handleValidateScan = async() => {

        if(isNewDongle){
            // Refresh Box components attribute
            const refreshBox = await refreshObjectAction(boxId,store).catch((err) => console.log(err)); 
            console.log('REFRESH_BOX :', refreshBox);
            // SHOW Loading and redirect after timeOut
            navigation.navigate("SolarAssistantHomeScreen")
        }else{
            const message = t(tns + ":" + "WAIT_DONGLE_DEDECTION")
            myToast(message)
        }
    }


    const RenderLoading = () => {
        return ( 
            <View>
                <LoadingAnimation
                    topText="Recherche du Dongle Radio, Veuillez patienter  SVP"
                />
            </View>
        )
    }

    const RenderNoDongle = () => {
        return (
            <Body>
                <View style={{ marginBottom: 25 }}>
                    <Text> {t(tns + ":" + "NO_DONGLE_FOUND")}</Text>
                </View>
            </Body>
        )
    }

    const RenderPlugDongleInstructions = ()=>{
        return(
            <View>
                <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 25, marginTop: 30,  backgroundColor: 'transparent' }}>
                    <Text style={[styles.text, {marginHorizontal:15}]}>
                        {t(tns + ":" + "INSTRUCTION_PLUG_DONGLE")}
                    </Text>
                </View>
                <InstructionBranchDongle />
                <View style={[styles.validateButton, { color: textColor }]}>
                    <Button 
                            onPress={handleValidateScan} //disabled={isNewDongle ? false :true}  
                            altStyle titleColor={isNewDongle ?'white':'gray'} title={t(tns + ":" + "VALIDATE")} 
                            bgColor={textColor} noBorder 
                        />
                </View>
            </View>
        )
    }

    return (
        <SafeAreaView>
            <View style={{ alignItems: 'center', justifyContent: 'flex-start', backgroundColor: bgcolor, paddingTop: 20 }}>
                <HeaderScreen title={t(tns + ":" + "EQUIP_CHOICE")} goBack={() => navigation.navigate("AddObject")} />
                    <Body>
                        {loading ?
                            <RenderLoading/>
                            :
                            <RenderPlugDongleInstructions/>
                        }
                    </Body>
            </View>
        </SafeAreaView>
    )
};


const styles = StyleSheet.create({
    validateButton: {
        width: 200,
        height: 50,
        marginTop: 50,
        alignSelf:'center'
    },
    text: {
        fontSize: 15,
        fontWeight: '400',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        flexWrap: 'wrap',
        lineHeight: 20,
        marginVertical: 10,
        color: '#3E495E'
    },
});

