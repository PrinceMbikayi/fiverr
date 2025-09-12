import React, { Component } from 'react';
import {useContext,useState,useRef,useEffect} from 'react';
import { useStore,useSelector,useDispatch } from 'react-redux';
import { ScrollView,View, Text,SafeAreaView,TouchableWithoutFeedback} from 'react-native';
import { ButtonWithStyle as Button } from '_components/ui/buttons/buttonWithStyle';
import styled from 'styled-components/native';
import { useTranslation } from 'react-i18next';
import { useNavigation,useRoute,StackActions } from '@react-navigation/native';



import { useTheme } from '_theming/themeProvider';
import {Api} from '_api'
import SearchList from '_components/list/searchList';
import AccessButton from '_components/forms/accessButton';
import {HeaderWithBack} from '_components/headers/header-with-back';
import {useMyTools} from '_helpers/myTools';
import {focusAddedProduct} from '_actions/app';
import { CountryPicker,getFlag } from './countryPicker';
//import { ScrollView } from 'r-eact-native-gesture-handler';


const WeatherWizard = (props) => {

    const isMounted = useRef(false);

    const { t, i18n } = useTranslation();    
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {}; 
    

    const {theme,baseColors} = useTheme();
    const {bgColor,textColor,headerBackgroundColor,headerTextColor} = baseColors;

    const myNavigationTool = useMyTools();
    
    const [progress,setProgress] = useState('start')
    const [country,setCountry] = useState('FR');
    const [countriesVisible,setCountriesVisible] = useState(false)
    const [selection,setSelection] = useState(null)

    
    // DID MOUNT
    useEffect(() => {
        isMounted.current = true;        
        // WILL UNMOUNT
        return () => (isMounted.current = false)
      }, []);


    const onSelect = (selection) => {
          setProgress("selected");
          setSelection(selection)
    }

    const loadWeatherLocations = async() => {
        res = await Api.getStaticFile("weather/weather_codes_"+country)
        console.log(res);
    }

    const create = async(name,id) => {
        try {
            res = await Api.createWeatherObject(name,id);
        } catch (e) {           
            console.log(e);            
        } finally {
            console.log('We do cleanup here');
        }

        console.log("création objet ",res)  
        if(res != undefined) {
            if(res.errCode && isMounted.current){

                if(res.errCode == 200) {
                    setProgress("created");                   
                } else {        
                    if(res.errMsg == "object_exists") {
                        setProgress("exists")
                    } else {
                        setProgress("error")
                    }                    
                }
            } 
        }
    }
    const lButtonCallback = () => {
        setProgress('start');
    }
    const lButtonLabel = t('CANCEL');

    const rButtonCallback = () => {
        create(selection.text,selection.id)
    }
    const rButtonLabel = t('CREATE')

    const goToNewWeather = () => {
        dispatch(focusAddedProduct(true));
        console.log("goToNewWeather > navigation",navigation)
        myNavigationTool.navigateToNewProduct(navigation)
        
    }

    const showCountries = () => {
        setCountriesVisible(!countriesVisible)
    }

    const changeCountry = (code) => {
        console.log(code)
        setCountriesVisible(false);
        setCountry(code);
       
    }


    const title = t("addProduct:ADD_WEATHER");

    return (
        <SafeAreaView style={{flex:1,backgroundColor:bgColor}}>
             <View style={{height:84,alignItems:'center',justifyContent:'center'}}>                
                    <HeaderWithBack  title={title} style={{marginRight:0}} themeDependency/>
                    <View style={{position:'absolute',height:72,top:0,alignSelf:'flex-end',right:10,justifyContent:'center',backgroundColor:'transparent'}}>
                        <TouchableWithoutFeedback onPress={showCountries}>  
                            {getFlag(country,32)}
                        </TouchableWithoutFeedback>
                    </View>
            </View>
          <View style={{flex:1,backgroundColor:bgColor}}>
            { progress == 'start' &&
                <>
                {countriesVisible &&
                    <ScrollView>
                        <CountryPicker callback={changeCountry}/>
                    </ScrollView>
                 }
                <SearchList endpoint={"weather/weather_codes_"+country} placeHolder={t('addProduct:ADD_WEATHER_SEARCH_PLACEHOLDER')}
                            onSelect={onSelect} createCallBack={create}/>
                </>
            }
            {progress == 'selected' &&
                <View style={{backgroundColor:bgColor,flex:1,paddingLeft:15,paddingRight:15}}>
                    <SelectionText color={textColor}>{t('addProduct:ADD_WEATHER_POINT_SELECTED',{name:selection.text})}</SelectionText>
                    <View style={{alignItems:'flex-end',flexDirection:'row',height:100,borderWidth:2,borderColor:'transparent'}}>
                        <View style={{flexDirection:'row',justifyContent:'space-between',padding:15,paddingBottom:25}}>
                            <View  style={{width:'48%'}}>
                                <AccessButton  onPress={lButtonCallback} title={lButtonLabel.toUpperCase()}/>
                            </View>
                            <View  style={{width:'48%'}}>
                                <AccessButton  onPress={rButtonCallback} title={rButtonLabel.toUpperCase()}/>
                                
                            </View>
                        </View> 
                    </View>
                </View>
            }
            {progress == 'created' &&
                <View style={{backgroundColor:bgColor,flex:1,paddingLeft:15,paddingRight:15}}>
                    <SelectionText color={textColor}>{t('addProduct:WEATHER_OBJECT_CREATED',{name:selection.text})}</SelectionText>
                    <AccessButton  onPress={goToNewWeather} title={t('addProduct:WEATHER_CREATED_SHOW').toUpperCase()}/>
                    
                </View>
            }
            {progress == 'exists' &&
                 <View style={{backgroundColor:bgColor,flex:1,paddingLeft:15,paddingRight:15}}>
                    <SelectionText color={textColor}>{t('addProduct:WEATHER_OBJECT_ALREADY_EXISTS',{name:selection.text})}</SelectionText> 
                        
                        <Button  
                            title= {t('addProduct:WEATHER_OBJECT_ADD_AGAIN').toUpperCase()}
                            onPress={lButtonCallback} 
                            containerStyle={{alignSelf:'center',marginTop:30}}
                           
                        />
                    </View>                
            }            
          </View>
          </SafeAreaView>
        );

}

export default WeatherWizard

const SelectionText = styled.Text`
            color:${props => props.color || 'green'};
            font-size:18px
        `;

