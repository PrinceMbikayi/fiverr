import React from 'react';
import { View, Text,SafeAreaView,StyleSheet,Image} from 'react-native';
import {useContext,useState,useRef,useEffect} from 'react';
import { useStore,useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigation,useRoute } from '@react-navigation/native';
import styled,{ThemeProvider} from 'styled-components/native';
import CheckBox from '@react-native-community/checkbox';

//---------------------------------------------------------
import { useTheme } from '_theming/themeProvider';

import {HeaderWithBack} from '_components/headers/header-with-back';
import AccessButton from '_components/forms/accessButton';
import {Api} from '_api';
import {refreshObjectAction} from '_actions/asyncActions';


//=========================================================
const DoorKeeperSettingsScreen = (props) => {

   
    const { t, i18n } = useTranslation();
    const { theme,baseColors} = useTheme();
    const {bgColor,textColor,headerBackgroundColor,headerTextColor} = baseColors;

    const bodyTextColor = textColor;


    const store = useStore();
    
    const navigation = useNavigation(); //v5
    const route = useRoute();
    const navigationParams = route?.params || {}; 
    const {itemId,title,actions : initActions  = [] } = navigationParams;
    
    const deviceOptionsRef = useRef({})
    const [deviceOptions,setDeviceOptions] = useState({});
    

    useEffect(() => {
      
     
         
      const toOpen = initActions.reduce((r,v,i) => {
        if(v == "STRIKE") r['door'] = true;
        if(v == "GATE") r['gate'] = true;       
          return r
        },{});
       
        deviceOptionsRef.current = toOpen;
        setDeviceOptions(toOpen)
     }, []);

    //First Step
    const [currentStep,setCurrentStep] = useState('selectOptions');

    
    const backgroundColor = bgColor;
    const invertOnBody = theme.onBodyInverse;

      //-----------------------------------

      const goBack = () => {
        console.log("goBack !!!!!")
        navigation.goBack();
      }

    // navigation to AddDoorKeeperGenerateQRCode is done in <AtHomeAddProductStepWifi/> using destination attribute

     // Attention à la version wizard sans props goBack


     const getHeader = () => {
       
        return  <View style={{height:84,alignItems:'center',justifyContent:'center'}}>
                         <HeaderWithBack title={title} goBack={{action:goBack}} themeDependency/>
                     </View>
        
     }
   
     //=====================================================

     const setOptions = async() => {
        // CONF. un paramètre : setup = both | gate | door | none
        let setup = "none"
        if(deviceOptions.gate == true)setup = "gate";
        if(deviceOptions.door == true)setup = "door";
        if(deviceOptions.door == true && deviceOptions.gate == true)setup = "both";      
        setCurrentStep('registering'); 
        const resp = await Api.executeAction(itemId,"CONF",{mArgs:[{name:'setup',value:setup}]}); 
       // console.log("resp",resp)
        refreshObjectAction(itemId,store);
        setCurrentStep('completed'); 
     } 

     const setToggleCheckBox = (type,value) => {
     
      //console.log("=====> newValue",type,value)
      let updateValue = {...deviceOptions}
      updateValue[type] = value;
      setDeviceOptions(updateValue);
      deviceOptionsRef.current = updateValue;
      //console.log("=============+> deviceOptionsRef.current",deviceOptionsRef.current)
    }

    

     const options= { 
      'gate': {type: 'gate',icon : require('_assets/images/interfaces/menu/gate.png'), label:"OPTION_GATE"},
      'door' : {type: 'door',icon: require('_assets/images/interfaces/door.png'),label:"OPTION_DOOR"},
    }

      const OptionLine = ({type,isFirst}) => {
        const size=50;
       
        return (
          <View style={{height:undefined,marginTop:5,marginBottom:10,borderBottomWidth:1,borderBottomColor: bodyTextColor}}>
            <View style={{height:undefined, flexDirection: 'row',flexWrap: "wrap",paddingBottom:10}}>
                <View style={{width: size, height: size, alignItems:'center',justifyContent:'center'}}>
                  <View style={{backgroundColor:bodyTextColor,borderRadius:size/2,height:size,width:size,alignItems:'center',justifyContent:'center'}}>
                      <Image source={options[type].icon} style={{height:size*0.7,width:size*0.7,tintColor:invertOnBody}}/>               
                  </View>   
                </View>
                <View style={{width: size, height: size, flexGrow:1,justifyContent:'center'}}>
                  <Text style={{paddingLeft:15,color:bodyTextColor,fontSize:16,flexWrap: 'wrap'}}>{t( "doorkeeper:"+ options[type].label)}</Text>
                </View>
                <View style={{width: size, height: size, alignItems:'center',justifyContent:'center'}}>
                  <CheckBox
                        disabled={false}
                        value={deviceOptions[type]}
                        onValueChange={(newValue) => setToggleCheckBox(type,newValue)}
                        onTintColor={bodyTextColor} onCheckColor={bodyTextColor} 
                        tintColors={{true:bodyTextColor,false:bodyTextColor}}
                  />  
                </View>
              </View>
          </View>        
        )
      }
      useEffect(() => {
        console.log("justUpdated",deviceOptions)
      }, [deviceOptions]);  
      
    // ----------------------------------


    const styledTheme = {color:bodyTextColor};
    return (
        <SafeAreaView style={{flex:1,backgroundColor:backgroundColor}}>            
            <>
            {
                getHeader()
            }
              </>
                <ThemeProvider theme={styledTheme}>
                <View style={{padding:20}}>
                   
                    
                    {currentStep == 'selectOptions' && 
                        <>
                            <TitleText centered>{t("doorkeeper:OPTIONS_DESCRIPTION")}</TitleText>
                            <VSpacer/> 
                            <OptionLine type="gate" isFirst/>
                            <OptionLine type="door" />
                            <VSpacer/>
                            <AccessButton  disabled={!deviceOptions?.gate && !deviceOptions?.door} onPress={setOptions} specialColor={bodyTextColor} isCentered title={t("addProduct:FINISH_PAIRING").toUpperCase()}/>  
                       
                        </>   
                    }
                    {currentStep == 'completed' && 
                         <View style={{alignItems:'center'}}>
                            <TitleText centered>{t("doorkeeper:OPTIONS_UPDATED")}</TitleText>
                            <VSpacer/> 
                            <View style={{width:100,height:100,borderRadius:50,backgroundColor:'white',alignItems:'center',justifyContent:'center'}}>
                              <Image source={require('../assets/check.png')} style={{width:'80%',height:'80%'}}/> 
                            </View>                            
                            <VSpacer/>                  
                           
                            <VSpacer/>
                            <AccessButton  onPress={goBack} specialColor={bodyTextColor} centered title={t("addProduct:PAIRING_COMPLETED").toUpperCase()}/>
                      
                        </View>
                    } 
                    {currentStep == 'generic_error' && 
                        <>                            
                          <TitleText centered>{t("addProduct:CAN_NOT_ADD_TITLE")}</TitleText>
                          <VSpacer/>                   
                          <BodyText>{t('addProduct:GENERIC_ERROR',{name:devicePairingInfos.typeName})}</BodyText>
                          <VSpacer/>
                        </>
                    }  
            </View> 
            </ThemeProvider>         
      </SafeAreaView>
    )              
}


export default DoorKeeperSettingsScreen

// exemple Styled common Styled 
const MyText = styled.Text`
    color:${attrs => attrs.theme.color || "red" };
    ${({centered}) => centered  && `
        text-align: center;
    `}
`;


const BodyText = styled(MyText)` 
     color:${attrs => attrs.theme.color || "red" };    
    font-size:14px;
`;

const TitleText = styled(MyText)` 
    color:${attrs => attrs.theme.color || "red" };  
    font-size:22px;    
`;

// exemple Styled with params and pixels
const VSpacer = styled.View`
    height:${attrs => attrs.height|| 30}px;
`;