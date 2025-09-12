import '_brand/templates/screens/routines/locales'
import React, {useState, useEffect, useRef} from 'react';
import { Text, TextInput, View, Pressable, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
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
import EcoConfortWinter from '_brand/images/icons/app/profaluxIconJs/EcoConfortWinter'
import { SelectList } from 'react-native-dropdown-select-list'
import { getObjectById } from '_helpers/objects';
import { MyButton } from '_brand/templates/components/ui/MyButton';
import { myToast } from '_brand/templates/components/ui/myToast';
import { EmojiSlider } from '_brand/templates/screens/routines/screens/applicationScreen/components/EmojiSlider';
import { SensorWidget } from '_brand/templates/screens/routines/screens/applicationScreen/components/SensorWidget';
import { EcoConfortCommonShutterWidget } from '_brand/templates/screens/routines/screens/applicationScreen/components/EcoConfortCommonShutterWidget';
import Meteo from '_brand/images/icons/app/profaluxIconJs/Meteo'
import Sun from '_brand/images/icons/app/profaluxIconJs/Sun'
import SunRise from '_brand/images/icons/app/profaluxIconJs/SunRise'
import SunSet from '_brand/images/icons/app/profaluxIconJs/SunSet'
import SunMin from '_brand/images/icons/app/profaluxIconJs/SunMin'
import SunMax from '_brand/images/icons/app/profaluxIconJs/SunMax'
import Cloud from '_brand/images/icons/app/profaluxIconJs/Cloud'
import CloudSunny from '_brand/images/icons/app/profaluxIconJs/CloudSunny'
import { useEcoConfort } from '_brand/templates/screens/routines/hook/useEcoConfort'
import EcoConfortIconActionConfig from "_brand/templates/screens/routines/config/EcoConfortIconActionConfig"

export const EcoConfortParameterScreen = (props)=>{
    const {} = props
    const uEcoConfort = useEcoConfort();
    const { 
            ecoConfortIdentity, setEcoConfortIdentity, updateEcoConfortAttribute,createEcoConfort,
            ecoConfEquipmentsByTypeName, updateEcoConfort, ecoConfGroupActions, setEcoConfGroupActions, initializeEcoConfortGroupAvtions
        } = uEcoConfort;

    const mode = ecoConfortIdentity?.mode;
    const initialTempThreshold = mode === "winter" ? ecoConfortIdentity?.winterTemptreshold : ecoConfortIdentity?.summerTempTreshold;
    const initialBrightness = mode === "winter" ? ecoConfortIdentity?.winterBrightnessTreshold : ecoConfortIdentity?.summerBrightnessTreshold;

    const { t, i18n } = useTranslation();
    const tns = "routine";
    const navigation = useNavigation();
    const route = useRoute();

  
    const navParams = route?.params || {};

    const [tempThreshold, setTempThreshold] = useState(initialTempThreshold);
    const [brightness, setBrightness] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isClicked, setIsClicked] = useState(false);

    const uScenario = useScenario();
    const {} = uScenario;


    console.log('ECO_CONFORT_IDENTITY :',ecoConfGroupActions);

    const { theme } = useTheme();
    const bgcolor = theme?.prflxbgColor || 'white';
    const headerBgColor = theme?.prflxHeaderBackground || '#FFFFFF'
    const textColor = theme?.prflxTextColor || 'black'

    const typesToDisplay = Object.keys(ecoConfEquipmentsByTypeName).filter(key => ecoConfEquipmentsByTypeName[key].length>0);
    console.log('NAVIGATION_PARAMETER_TYPEDISPLAY :', ecoConfEquipmentsByTypeName);
    

    const goBack = () => {22
        navigation.goBack()
      }




    const handleSetTempThreshold = (value)=>{
        if(!isNaN(value)){
            setTempThreshold(value);
            if(ecoConfortIdentity?.mode === "winter"){
                updateEcoConfortAttribute("winterTemptreshold",value);
            }else{
                updateEcoConfortAttribute("summerTempTreshold",value);
            }
        }
    }
    
    const handleSelectedAction = (actionId)=>{
        console.log('SELECTED_ACTION :', actionId);
    }


    useEffect(()=> {
        console.log('TEMP_THRESHOLD_CHANGED :', tempThreshold);
    },[tempThreshold]);

    useEffect(()=> {
        console.log('BRIGHTNESS_CHANGED :', brightness);
    },[brightness]);

    const handleBrightnessChange = (value)=>{
        console.log('LUMINOSITY_THRESHOLD :', value);
        setBrightness(value);
        if(ecoConfortIdentity?.mode === "winter"){
            updateEcoConfortAttribute("winterBrightnessTreshold",value.toString());
        }else{
            updateEcoConfortAttribute("summerBrightnessTreshold",value.toString());
        }
    }

    function defineActionValue(selectedAction){
        const actionConfig ={
            "OPEN":"open",
            "CLOSE":"closed",
            "FAV_CALL_1":"pos1",
            "FAV_CALL_3":"pos3",
        }
        const action = selectedAction?.split("/").shift()
        return actionConfig[action]
    }


    const validate = async()=>{
        const newAction = ecoConfGroupActions?.myActions_1.shift();
        let addActionValue;
        if(newAction){
            const act = newAction.split("/").shift();
            addActionValue = defineActionValue(newAction);
        }else{
            addActionValue = mode === "winter" ? "closed" : "open";
        }
        setIsClicked(true);
        setLoading(true);
        const res = await updateEcoConfort(["activated","deactivated","climatic", addActionValue]).catch((err) => console.log(err));
        console.log('CREATE_ECO_CONFORT_SERVER_RESPONSE :', res);
        if(res.errCode == 200){
            setIsClicked(false);
            setLoading(false);
        }else{
            setIsClicked(false)
            setLoading(false);
        }
    }

    const endCreation = async()=>{
        setIsClicked(true);
        setLoading(true);
        const mode = ecoConfortIdentity.mode;
        const name = ecoConfortIdentity.ecoConfortName;
        const ecoConfortId = ecoConfortIdentity.ecoConfortId;
        const sensorId = ecoConfortIdentity.sensorId;
        const newAction = ecoConfGroupActions?.myActions_1.shift();
        let exitClimatic;
        if(newAction){
            const act = newAction.split("/").shift();
            exitClimatic = defineActionValue(newAction);
        }else{
            exitClimatic = mode === "winter" ? "closed" : "open";
        }

        console.log('EXIT_CLIMATIC :', newAction, exitClimatic);
        const paramsValues = ["activated","deactivated","climatic",exitClimatic]

        if(!ecoConfortId){
            const result = await createEcoConfort (name, mode, sensorId, paramsValues).catch((err) => console.log(err));
            console.log('CREATE_ECO_CONFORT_SERVER_RESPONSE_PARAMETERS_SCREEN :', result);
            if(result.errCode == 200){
                const newEcoId = result?.id
                //const appVersion = result?.res?.data?.resource?.appVersion
    
                // NOW UPDATE THE ECO CONFORT
                const res = await updateEcoConfort(newEcoId, paramsValues).catch((err) => console.log(err));
                console.log('CREATE_ECO_CONFORT_SERVER_RESPONSE :', res);
                console.log('YES_UPDATE_ECO_CONFORT_SERVER_RESPONSE_CONFIRM :',mode, exitClimatic,  res);
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

    const TextShuttersPosition = (props)=>{
        const {mode} = props;
        let text = mode === "winter" ? t(tns + ":" + "WINTER_ECOCONFORT_SHUTTERS_POSITION") : t(tns + ":" + "SUMMER_ECOCONFORT_SHUTTERS_POSITION");
        return(
            <View>
            <Text style={{fontSize:16, color:textColor, marginTop:20, marginBottom:15,}}>
                {t(tns + ":" + text)}
            </Text>
        </View>
        )
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
                    <View style={{justifyContent:'center', alignItems:'center', padding:20, marginTop:0, opacity: loading ? 0.3 : 1}} >
                        <View>
                            <SensorWidget itemId={ecoConfortIdentity?.sensorId}/>
                        </View>
                                    
                        <View style={{marginTop:10}}>
                            <Text style={{fontSize:16, color:textColor, marginTop:20, marginBottom:15,}}>
                               {ecoConfortIdentity?.mode === "winter" ? t(tns + ":" + "IF_WINTER_TEMPERATURE_TRESHOLD") : t(tns + ":" + "IF_SUMMER_TEMPERATURE_TRESHOLD")}
                            </Text>
                            <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                                <TextInput
                                    value={tempThreshold}
                                    defaultValue={`${tempThreshold}`}
                                    onChangeText={handleSetTempThreshold}
                                    blurOnSubmit={true}
                                    number-pad //only integer (other types : numeric, decimal-pad, phone-pad...)
                                    editable={true}
                                    keyboardType="numeric"
                                    textAlign="center"
                                    style={{padding:5,alignSelf:'center', textAlign:'center', backgroundColor:'#EDEDED',
                                            fontSize:16, borderRadius:7,width:50, color:textColor
                                    }}
                                />
                                <Text style={{fontSize:16, fontWeight:'400',color:textColor}}>°C</Text>
                            </View>
                        </View>

                        <View style={{marginTop:20}}>
                            
                        </View>
                        <View>
                            <EmojiSlider 
                                sliderTitle={ecoConfortIdentity?.mode === "winter" ? t(tns + ":" + "WINTER_LUMINOSITY_TRESHOLD") : t(tns + ":" + "SUMMER_LUMINOSITY_TRESHOLD")}
                                LeftPicto={Cloud}
                                RightPicto={SunMax}
                                MiddlePicto={Meteo}
                                iconSize={25}
                                initialBrightness={initialBrightness}
                                callBackSliderValue={handleBrightnessChange}
                                />
                        </View>

                        <TextShuttersPosition mode={mode}/>

                        <View>
                            <Text style={{fontSize:16, color:textColor, marginTop:0, marginBottom:15,}}>
                                {t(tns + ":" + "TRESHOLD_SHUTTERS_POSITION_BY_TYPE")}
                            </Text>
                        </View>
                        <View style={{flex:1}}>
                            {typesToDisplay.map((type, index)=>{
                                    console.log('TYPE_TO_DISPLAY :', type);
                                        return(
                                                <EcoConfortCommonShutterWidget 
                                                    key={index}
                                                    typeName={type}
                                                    itemId={EcoConfortIconActionConfig[type].itemId}
                                                    callBack={handleSelectedAction}
                                                    />
                                        )
                                    }
                                )
                            }
                        </View>

                        <View style={{ minWidth: 200, marginTop: 50 }}>
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