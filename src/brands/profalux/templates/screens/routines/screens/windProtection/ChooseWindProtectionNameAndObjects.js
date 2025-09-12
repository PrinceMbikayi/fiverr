import '_brand/templates/screens/routines/locales'
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text,TextInput, ScrollView, } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useStore, useSelector } from "react-redux";
import { RenderToogleFlatList } from '_brand/templates/components/objects/groupObject/components/RenderToogleFlatList';
import { useTheme } from '_theming/themeProvider'
import { HeaderWithBack } from '_brand/templates/components/headers/header-with-back';
import Button from '_brand/templates/components/ui/Button';
import { getObjectsByNames,getObjectsByTypes, getObjectsByTypeName } from '_helpers/selectors';
import { myToast } from '_brand/templates/components/ui/myToast';
import { getObjectById } from '_helpers/objects';
import {ObjectExistsWarning} from "_brand/templates/screens/routines/screens/ObjectExistsWarning"
import { SingleFormWithValidation } from './SingleFormWithValidation';
import { useWindProtection } from '_brand/templates/screens/routines/hook/useWindProtection'
import {GlobalToast} from '_brand/templates/components/objects/common/GlobalToast'
import {useGlobalModal} from '_components/ui/globalModal'


export const ChooseWindProtectionNameAndObjects = (props)=>{
    const navigation = useNavigation();
    const route = useRoute();
    const formRef = useRef(null);
    const thresholdRef = useRef(30)

      const globalModal = useGlobalModal();  
  
    const navParams = route?.params || {};
    const {sensorId}=navParams
    console.log('NAVIGATION_PARAMETER :', sensorId);
    const store = useStore();


    const useWindProtect = useWindProtection();
    const { 
            windProtectionIdentity, setWindProtectionIdentity,
            onclickObjectToProtect,resetWindProtectionIdentity
    } = useWindProtect;

  
    const { theme } = useTheme();
    const containerbgcolor = theme?.prflxContaintBgColor || 'white';
    const bgcolor = theme?.prflxbgColor || 'white';
    const headerBgColor = theme?.prflxHeaderBackground || '#FFFFFF'
    const iconColor = theme?.prflxIconColor || "#3E495E";
    const textColor = theme?.prflxIconColor || "#3E495E";
    const iconBgColor = theme?.prflxIconbgColor || "#FFFFFF";

    const shutters = useSelector(getObjectsByTypes)["Shutter"];
    const profalux868 = useSelector(state => getObjectsByTypeName(state, "Rolling_Shutter_Profalux")) || [];
    const groups = useSelector(state => getObjectsByTypeName(state, "composite")) || [];
    const toExclude = groups
    //const toExclude = groups.concat(profalux868); 
    const selectable = shutters.filter(x => !toExclude?.includes(x));
  
  
    // const [nameExists, setNameExists] = useState(false);
    const [idForExistName, setIdForExistName] = useState(null);
    const [warning, setWarning] = useState(false);
    const [solarShutterIsSelected, setSolarShutterIsSelected] = useState(false);
    const [windSpeed, setWindSpeed] = useState(windProtectionIdentity?.threshold || 30);
    //const [windSpeed, setWindSpeed] = useState(windProtectionIdentity?.threshold || 30);
  
    const { t, i18n } = useTranslation();
    const tns = "routine";
  
    const allObjectNames = useSelector(getObjectsByNames);
  
    const hasValue = (obj, value) => Object.values(obj).includes(value);

    const hasKey = (obj, key) => Object.keys(obj).includes(key);


      const modalTitleColorRef = useRef("#3E495E")
      const modalToastBgColorRef = useRef("white")
      const modalBodyTextColorref = useRef("#3E495E")
      const modalToastTitleRef = useRef(t(tns + ":" + "WARNING"))
      const messageRef = useRef("")
      const buttonsRef = useRef([...buttons])
  

    useEffect(()=> {
    
    },[solarShutterIsSelected]);

    useEffect(()=> {
      console.log('WIND_SPEED_CHANGED :', windSpeed);
    },[windSpeed]);

  
    useEffect(() => {
    }, [selectable]);
  
  
    // useEffect(()=> {
    
    // },[nameExists]);

      useEffect(()=> {
        console.log("ID_FOR_NAME_EXISTS_OBJECT :", idForExistName)
      },[idForExistName]);
  

  
    const goRoutinesHomeScreen = () => {
      resetWindProtectionIdentity()
      navigation.navigate('RoutinesHomeScreen', { screen: 'RoutinesHomeScreen' });
    }
  
    const submitMe = async () => {
      const selection = windProtectionIdentity.shutters
      if(selection.length == 0){
        myToast(`${t(tns + ":" + "SELECT_OBJECT_TO_PROTECT")}`)
      }else{
        formRef.current.submitForm();
      }
    }
  
    const handleSubmit = (values) => {
        console.log('HELLO_WIND_PROTECTION :', values);
        const {isValid} = values

        if(!isValid){
          const message = values?.errMsg
          myToast(`${t(tns + ":" + message)}`)
        }
        if(isValid){
          const name = values?.name
          const isNameExists = hasKey(allObjectNames, name)
          const preExistObjectId =allObjectNames[name]
          console.log("IS_NAME_EXISTS :",isNameExists, preExistObjectId, name, allObjectNames)

          if(isNameExists){
            //setNameExists(true)
            if(windProtectionIdentity?.windProtectionName == name){
              // Do nothing : it's the same object in modification
              setWindProtectionIdentity({
              ...windProtectionIdentity,
              windProtectionName: name,
              threshold:windSpeed,
            })
              setWarning(false)
              navigation.navigate('WindProtectionConfirmScreen')
            }else{
              setWarning(true)
              setIdForExistName(preExistObjectId)
            }
          }

          if(!isNameExists){
            setWindProtectionIdentity({
              ...windProtectionIdentity,
              windProtectionName: name,
              threshold:windSpeed,
            })
            setWarning(false)
            //setNameExists(false)
            navigation.navigate('WindProtectionConfirmScreen')
          }
        }

    }


    const onItemClick= (id) => {
      const objectDatas = getObjectById(id);
      const position = windProtectionIdentity.shutters?.indexOf(id)

      const isObjectConnected = objectDatas?.connected 

       if(isObjectConnected){
        onclickObjectToProtect(id);
       }else{
        console.log("posiion !!!!!",position)
        if(position != -1) {
          onclickObjectToProtect(id);
        } else {
          myToast(`${t(tns + ":" + "CANNOT_SELECT_DISCONNECTED_OBJECT")}`,null,null,1000)
        }
         
       }
    }
  
  
    const handleOnHide = ()=>{
      setIdForExistName(null)
    }

    const onWindThresholdChange = (value) => {

      console.log('WIND_THRESHOLD_SUBMITED :',value, windSpeed);
      messageRef.current = `${t(tns + ":" + "WIND_THRESHOLD_DEPEND_ON_NF_CLASS_OF_YOUR_PRODUCTS")}`
      buttonsRef.current = buttons
      thresholdRef.current = windSpeed
      openPopup()
    }

      //???????????????????????????????????????????????????????????
          const buttons = [
              {
                  id:"return",
                  text:`${t(tns + ":" + "CANCEL")}`,
                  action:()=>onCancelPressed(),
                  textColor:"#007AFF"
              },
              {
                  id:"validate",
                  text:`${t(tns + ":" + "VALIDATE")}`,
                  action:()=>onValidate(),
                  textColor:"#007AFF"
              }
          ]
      
        const onCancelPressed = () => {
          setWindSpeed(windProtectionIdentity?.threshold || 30)
          globalModal.close();
        }
        const onValidate = () => {
          console.log('VALUE_WIND_THRESHOLD :', thresholdRef.current);
          setWindSpeed(thresholdRef.current)
          globalModal.close();
        }
  
      
        const openPopup = () => {  
            const content = (
              <View style={{width:"80%", backgroundColor:'transparent',alignSelf:'center',justifyContent:'center',alignItems:'center', borderRadius:14}}>
                  <GlobalToast 
                      toastTitle={modalToastTitleRef.current}
                      toastBody={messageRef.current}
                      buttons={buttonsRef.current}
                  />
              </View>
                  )
            globalModal.setContent(content,{type:'centered'});    
            globalModal.toggle();
        }
      //???????????????????????????????????????????????????????????
    


    return(
        <SafeAreaView style={{ height: '100%', backgroundColor: 'white' || bgcolor }} >
  
            <View style={{ flex: 1, backgroundColor: 'white', }}>
      
              <View style={{ backgroundColor: 'transparent' || headerBgColor, alignItems: 'center', justifyContent: 'flex-end' }}>
                <HeaderWithBack
                  title= {windProtectionIdentity?.windProtectionName}
                  backSVG centered
                  goBack={{ action: goRoutinesHomeScreen }}
                  noShadow />
              </View>
      
              <ScrollView style={[styles.bodyWrapper, { backgroundColor: bgcolor }]}>
                <View style={[styles.bodyContent, { marginBottom: 20,marginTop:10, backgroundColor: containerbgcolor }]}>
                  <SingleFormWithValidation
                      ref={formRef}
                      formLabel={`${t(tns + ":" + "NAME_SCENARIO")}`}
                      handleSubmit={handleSubmit}
                      defaultName={windProtectionIdentity?.windProtectionId ? windProtectionIdentity?.windProtectionName :""}
                  />
      
                  {(idForExistName && warning) && 
                    <ObjectExistsWarning 
                          itemId = {idForExistName}
                          onHide={handleOnHide}
                          article={`${t(tns + ":" + "A_ARTICLE_FEMININE")}`}
                      />
                  }
      
                  <View style={{flexDirection:'column', justifyContent:'flex-start', alignItems:'center', marginTop:30,backgroundColor:'transparent'}}>
                        <Text style={{fontSize:14, fontWeight:'600',color:textColor}}>{`${t(tns + ":" + "ACTIVATE_PROTECTION_IF_THRESHOLD")}`}</Text>
                      <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                        <TextInput
                            value={windSpeed}
                            defaultValue={`${windSpeed}`}
                            onChangeText={(val)=>{setWindSpeed(val)}}
                            //onSubmitEditing={onWindThresholdChange}
                            //blurOnSubmit={true}
                            onBlur={onWindThresholdChange}
                            number-pad //only integer (other types : numeric, decimal-pad, phone-pad...)
                            editable={true}
                            maxLength={2}
                            keyboardType="numeric"
                            textAlign="center"
                            style={{padding:5,alignSelf:'center', textAlign:'center', backgroundColor:'#EDEDED',
                                    fontSize:16, borderRadius:7,width:50, color:textColor
                            }}
                        />
                        <Text style={{fontSize:16, fontWeight:'400',color:textColor}}> km/h</Text>
                      </View>
                  </View>
        
                  <View style={{backgroundColor:'transparent', justifyContent:'flex-start'}}>
                    <Text style={{marginVertical:20,fontSize:14,fontWeight:"600", color:textColor}}> 
                      {`${t(tns + ":" + "SELECT_EQUIP_TO_PROTECT")}`}
                    </Text>
                    <RenderToogleFlatList
                      numColumns={4}
                      isRedirectOnSelect={false}
                      selectable={selectable}
                      selection={windProtectionIdentity?.shutters}
                      callBack={onItemClick}
                      bgColor={iconColor}
                      iconColor={iconBgColor}
                    />
                  </View>

                  <View style={{}}>
                    <Button onPress={submitMe} altStyle title={t(tns + ":" + "NEXT")} titleColor='white' bgColor={iconColor} noBorder />
                  </View>

                </View>
              </ScrollView>
              
            </View>
          </SafeAreaView>
    )
} 

const styles = StyleSheet.create({
    bodyWrapper: {
      flex: 1,
      flexDirection: 'column',
      //backgroundColor:'#EBF1F5',
      padding: 5,
    },
    bodyContent: {
      flex: 1,
      justifyContent: 'center',
      padding: 10,
      borderColor: 'orange',
      borderWidth: 1,
      borderRadius: 10,
  
    },
  })