import '_brand/templates/screens/routines/locales'
import React, {useState, useEffect, useRef} from 'react';
import { Text, View, Pressable, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';

import { useNavigation, useRoute } from '@react-navigation/native';

import { useTheme } from '_theming/themeProvider'
import { getObjectsByTypeName } from '_helpers/selectors';
import { HeaderWithBack } from '_brand/templates/components/headers/header-with-back';
import { CardImageWithArrow } from '_brand/templates/screens/addObject/components/addBoxComponents/CardImageWithArrow';
import {iconsJs} from '_brand/utils/iconsJs';
import CustomRoutine from '_brand/images/icons/app/profaluxIconJs/CustomRoutine'
import {useScenario} from '_brand/templates/screens/routines/hook/useScenario'
import {EcoCard} from '_brand/templates/components/objects/common/EcoCard'
import EcoConfortSummer from '_brand/images/icons/app/profaluxIconJs/EcoConfortSummer'
import EcoConfortWinter from '_brand/images/icons/app/profaluxIconJs/EcoConfortWinter'
import { SelectList } from 'react-native-dropdown-select-list'
import { getObjectById } from '_helpers/objects';
import { MyButton } from '_brand/templates/components/ui/MyButton';
import { myToast } from '_brand/templates/components/ui/myToast';
import { useEcoConfort } from '_brand/templates/screens/routines/hook/useEcoConfort'
import {RoutineEcoConfortCard} from '_brand/templates/screens/routines/screens/applicationScreen/components/RoutineEcoConfortCard'


export const EcoConfortConfirmConfigurationScreen = (props)=>{
    const {} = props
    const { t, i18n } = useTranslation();
    const tns = "routine";
    const navigation = useNavigation();
    const route = useRoute();
  
    const navParams = route?.params || {};

    const uScenario = useScenario();
    const { 
        } = uScenario;


  const uEcoConfort = useEcoConfort();
  const { 
        ecoConfortIdentity, updateEcoConfort, ecoTargetForDelete, createEcoConfort,
        initializeEcoConfortGroupAvtions
      } = uEcoConfort;
      
      console.log('ECO_CONFORT_IDENTITY_CHECK :', ecoConfortIdentity);
      console.log('DELETE_ECO_TARGET :', ecoTargetForDelete);

    const { theme } = useTheme();
    const bgcolor = theme?.prflxbgColor || 'white';
    const headerBgColor = theme?.prflxHeaderBackground || '#FFFFFF'
    const textColor = theme?.prflxTextColor || 'black'

    const [isClicked, setIsClicked] = useState(false);
    const [loading, setLoading] = useState(false);


     useEffect(()=> {
     
     },[isClicked]);

    const goBack = () => {
        navigation.goBack()
      }

    const endCreation = async()=>{
        setIsClicked(true);
        setLoading(true);
        const mode = ecoConfortIdentity.mode;
        const name = ecoConfortIdentity.ecoConfortName;
        const ecoConfortId = ecoConfortIdentity.ecoConfortId;
        const sensorId = ecoConfortIdentity.sensorId;
        const exitClimatic = mode == "winter" ? "closed" : "open"; 
        const paramsValues = ["activated","deactivated","climatic",exitClimatic]

        if(!ecoConfortId){
            console.log('ENTRER_IF');
            const result = await createEcoConfort (name, mode, sensorId, paramsValues).catch((err) => console.log(err));
            console.log('CREATE_ECO_CONFORT_SERVER_RESPONSE :', result);
            if(result.errCode == 200){
                const newEcoId = result?.id
                //const appVersion = result?.res?.data?.resource?.appVersion
    
                // NOW UPDATE THE ECO CONFORT
                const res = await updateEcoConfort(newEcoId, paramsValues).catch((err) => console.log(err));
                console.log('CREATE_ECO_CONFORT_SERVER_RESPONSE :', res);
                console.log('YES_CREATE_ECO_CONFORT_SERVER_RESPONSE_CONFIRM :',mode, exitClimatic,  res);
                if(res.errCode == 200){
                    setIsClicked(false);
                    setLoading(false);
                }else{
                    setIsClicked(false)
                    setLoading(false);
                }
    
            }else{
                console.log('Error thrown to useEcoConfort hook !!');
                setLoading(false);
            }

        }else{// THIS IS MODIFICATION
            // NOW UPDATE THE ECO CONFORT
            console.log('ENTRER_ELSE');
            const res = await updateEcoConfort(ecoConfortId,paramsValues).catch((err) => console.log(err));
            console.log('CREATE_ECO_CONFORT_SERVER_RESPONSE :', res);
            console.log('YES_CREATE_ECO_CONFORT_SERVER_RESPONSE_CONFIRM :',mode, exitClimatic,  res);
            if(res.errCode == 200){
                setIsClicked(false);
                setLoading(false);
            }else{
                setIsClicked(false)
                setLoading(false);
            }

        }

    }

    const pictoMode = {
        "summer": EcoConfortSummer,
        "winter": EcoConfortWinter
    }



    

    const modifyParameters = ()=>{
        console.log('ECO_CONFORT_IDENTITY :', ecoConfortIdentity);
        if(ecoConfortIdentity?.ecoConfortId){
            navigation.navigate("EcoConfortParameterScreen")
        }else{
            initializeEcoConfortGroupAvtions(ecoConfortIdentity?.mode)
            navigation.navigate("EcoConfortParameterScreen")
        }
    }

    let title;
    if(ecoConfortIdentity?.ecoConfortName){
        title = ecoConfortIdentity?.ecoConfortName
    }else{
        title = ecoConfortIdentity?.mode == "winter" ? `${t(tns + ":" + "ECOFONFORT_WINTER")}` : `${t(tns + ":" + "ECOFONFORT_SUMMER")}`
    }

    return(
        <SafeAreaView style={{ height: '100%', backgroundColor: 'white' || bgcolor }} >
            <View style={{ flex: 1, backgroundColor: bgcolor, }}>
                <View style={{ backgroundColor: 'transparent' || headerBgColor, alignItems: 'center', justifyContent: 'flex-end' }}>
                    <HeaderWithBack
                        title={title}//
                        backSVG centeredP
                        goBack={{ action: goBack }}
                        noShadow 
                    />
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{justifyContent:'center', alignItems:'center', padding:20, marginTop:0,  opacity: loading ? 0.3 : 1}} >
                        <EcoCard titlePart1={"Eco"} titlePart2={'Confort'} iconSize={40} Picto={pictoMode[ecoConfortIdentity?.mode ||"summer"]}/>
                        <View style={{marginTop:40}}>
                            <Text style={{fontSize:16,fontWeight:'600', textAlign:'center',color:textColor}} >
                                {t(tns + ":" + "ECO_CONFIG_CONGRATS")} {ecoConfortIdentity.mode=="winter"? t(tns + ":" + "WINTER") :t(tns + ":" + "SUMMER")}.
                            </Text>
                        </View>
                        <View style={{marginTop:20}}>
                            <Text style={{fontSize:16,fontWeight:'400', textAlign:'center',color:textColor}} >
                                {t(tns + ":" + "ECO_PARAMS_DESCRIPT")}
                            </Text>
                        </View>

                        <View style={{ minWidth: 200, marginTop: 20}}>
                            <RoutineEcoConfortCard 
                                iconColor={textColor}
                                text={`${t(tns+":"+"MODIFY_ECO_PARAMS")}  ${ecoConfortIdentity.mode=="winter"? t(tns + ":" + "WINTER") :t(tns + ":" + "SUMMER")}`}  
                                handleNavigation={modifyParameters}
                            />
                            {/* <MyButton onPress={modifyParameters} title={t(tns + ":" + "MODIFY_ECO_PARAMS")} /> */}
                        </View>
                        <View style={{ minWidth: 200, marginTop: 30 }}>
                            <MyButton onPress={endCreation} title={t(tns + ":" + "END")} disabled={isClicked ? true : false}/>
                        </View>

                    </View>

                    {loading &&
                            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ marginVertical: 50 }}>
                                    <ActivityIndicator size="large" color='#3E495E' style={{ transform: [{ scaleX: 4 }, { scaleY: 4 }] }} />
                                    <Text style={{ marginTop: 60, color: textColor, fontSize: 14, fontWeight: "500" }}>{t(tns + ":" + "ROUTINE_CONFIGURATION_LOADING")}</Text>
                                </View>
                            </View>
                        }
                    <View style={{width:'100%', height:50, backgroundColor:'transparent'}}/>
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}