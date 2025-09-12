import React from 'react';
import {useState,useRef,useEffect} from 'react';
import { View,Text,SafeAreaView, Pressable} from 'react-native';

import { useTranslation } from 'react-i18next';
import { useNavigation,useRoute} from '@react-navigation/native';
//------------------------------------------------------------------

import { useTheme } from '_theming/themeProvider';
import {HeaderWithBack} from '_components/headers/header-with-back';
import InfoCircle from '_brand/images/icons/app/InfoCircleR';
import { MultiPurposeLine } from "_components/list/multiPurposeLine";
import {H1} from  '_brand/templates/styled'; 
import InputSolo from '_brand/templates/components/forms/inputSolo'


//==================================================================


const defaultGiveNameDatas = {
  "headerTitle"  : "HeaderTitle",
  "question" : "GiveName Question",
  "options" : [{"label" : "Option A","value": "A"},{"label" : "Option B","value": "B"}],
  "custom" : "custom name"
}

const CommonNameScreen = (props) => {

  


    const {noBack = false} = props


    const isMounted = useRef(false)
    const { t, i18n } = useTranslation();
    const { theme,baseColors} = useTheme();
    const {bgColor} = baseColors;   
    
    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {}; 

   

    const {itemId,update : isUpdate, productId : atHomeObjectType} = navigationParams || {}
    const tns = "motor";
    console.log("Common NAME OBJECTparse and so >>>",JSON.parse(JSON.stringify(navigationParams?.giveNameDatas)));
    const giveNameDatas = navigationParams?.giveNameDatas || defaultGiveNameDatas;
 
    //const title=t(tns+":"+"GIVE_NAME_TITLE");
    const title= giveNameDatas?.headerTitle || "nope2";
    console.log("title",title,giveNameDatas?.headerTitle)

    const nameCustom = giveNameDatas.custom || "nope nope";
    const inputSoloPlaceHolder = nameCustom;


    // DID MOUNT
    // exemple mount / unmount fonctional component
    useEffect(() => {
        isMounted.current = true;       
        if(isUpdate) {
                //   
        }
        // WILL UNMOUNT
        return () => (isMounted.current = false)
      }, []);



      const goBack = () => {       
       navigation.goBack()
      }


    // Attention à la version wizard sans props goBack    

    const close = () => {
      goBack()
    }


    const ScreenHeader = (props) => {
      
      const {noBack = false} = props
      const hTitle =  title;
      const hGoback = goBack ;
       return  <View style={{height:84,alignItems:'center',justifyContent:'center'}}>
                        <HeaderWithBack centered backSVG noBack={noBack} title={hTitle} goBack={{action:hGoback}} noShadow bgColor="transparent" extraButtons={[{action:showInfos,svgr:<InfoCircle/>}]}/>
                    </View>       
    }    
   

    //------------------------------------------------
    const backgroundColor = bgColor
    // ----------------------------------

    const showInfos = () => {
      console.log("ShowInfos > show ifos")
    }

    const giveName = async(value) => {
      
      const goNext = navigationParams.next;
      console.log("giveName",value,'goNext',goNext);
      if(goNext) {
      
        navigation.navigate(goNext,{'name':value,'setName':true})
      }
     
     // 
    }

    const [customName, setCustomName] = useState(t(tns+":"+"NAME_CUSTOM"));

    const [soloValue, setSoloValue] = useState(null);

    const onOpenSolo = () => {
      setSoloValue("")
    }

    const onSoloValidate = (value) => {
      console.log('onSoloValidate',value)
      setSoloValue("done");
      const newName = value.trim()
      if(newName.length > 3) {
        console.log("newName",newName)
        giveName(value)
      }
    }

    const onCancelSolo = () => {
      setSoloValue("canceled");
    }

    const goNext = () => {

    }



    const Options = () => {
      const questions = giveNameDatas?.options || []
      return (
        <>
        {questions.map((v,i) => {
              return (
                <MultiPurposeLine title= {v.label}  key = {"kokey"+i} fullTouchable callback={giveName} id = {v.value} />
              )
        })}
        </>
      )
    }

    

    return (
        <SafeAreaView style={{flex:1,backgroundColor:'white' || backgroundColor}}>            
          <ScreenHeader  goBack={goBack} showInfos={showInfos} noBack={noBack}/>  
          <View style={{paddingLeft:24,paddingRight:24}}>
            <H1>{giveNameDatas?.question || ""}</H1>  
           <Options/>
           <View>
              <Pressable onPress={onOpenSolo} style={{padding:16}}>
                <Text>{nameCustom}</Text>
              </Pressable>
            </View>           
            <InputSolo value={soloValue} title={t("qrbasic:INPUT_OBJECT_LABEL")} placeholder={inputSoloPlaceHolder} hidden onValidate={onSoloValidate} onCancel={onCancelSolo}/>
            
          </View>
        
        </SafeAreaView>
    )        
}

export default CommonNameScreen
