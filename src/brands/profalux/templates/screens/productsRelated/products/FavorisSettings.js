import "_brand/templates/screens/productsRelated/products/locales"
import React, { useState, useRef, useEffect} from 'react';
import {SafeAreaView,Text, View, ScrollView, StyleSheet, StatusBar, Dimensions} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation,useRoute } from '@react-navigation/native';
import { useSelector,useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';

import { useTheme} from '_theming/themeProvider'
import {AutomatedTestIdDisplay} from '_components/objects/@common/testAutomation/AutomatedTestId';


import { HeaderWithBack } from '_brand/templates/components/headers/header-with-back';


import { RenderToogleFlatList } from '_brand/templates/components/objects/groupObject/components/RenderToogleFlatList';
import {getObjectsVisible} from '_helpers/selectors';
import Button from '_brand/templates/components/ui/Button';
import {userAddFovorite, userRemoveFavorite} from '_actions/user';
import {getObjectsByTypes, getObjectsByTypeName} from '_helpers/selectors';
import {appRefresh} from '_actions/app';
import { alphabeticSort } from '_brand/utils/alphabeticSort';



const { width } = Dimensions.get('window')
export const FavorisSettings = ()=>{


    const dispatch = useDispatch();

    const { t, i18n } = useTranslation();
    const tns = 'products';
    const {theme } = useTheme();

    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {};
    //console.log("NAVIGATION PARAMS :", navigationParams);

    const borderColor = theme?.prflxBorderColor||'orange';
    const Containerbgcolor = theme?.prflxContaintBgColor||'white';
    const bgcolor = theme?.prflxbgColor||'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor||"white";
    const textColor = theme?.prflxTextColor||'black'
    const headerBgColor = theme?.prflxHeaderBackground || '#FFFFFF'

    const objectsVisible = useSelector(getObjectsVisible);
    const objectWeather = useSelector(getObjectsByTypes)["Weather"]||[];
    const netatmoToRemove = useSelector(getObjectsByTypes)["Netatmo"]||[];
    const netatmoStation = useSelector(state =>getObjectsByTypeName(state,"NetatmoStation"));
    const netatmoIndoorProbe = useSelector(state =>getObjectsByTypeName(state,"NetatmoIndoorProbe"));
    const netatmoOutdoorProbe = useSelector(state =>getObjectsByTypeName(state,"NetatmoOutdoorProbe"));
    const netatmoRainGauge = useSelector(state =>getObjectsByTypeName(state,"NetatmoRainGauge"));
    const netatmoWindGauge = useSelector(state =>getObjectsByTypeName(state,"NetatmoWindGauge"));
    const scenarios = useSelector(state =>getObjectsByTypeName(state,"Associations"));
    const remote = useSelector(getObjectsByTypes)["Remote"]||[];
    const weeklyPlanner = useSelector(getObjectsByTypes)["WeeklyPlanner"]||[];

    const toExclude = objectWeather.concat(netatmoToRemove, remote, weeklyPlanner)
    const filteredVisibleObjects = objectsVisible.filter(x => !toExclude?.includes(x))
    
    const selectableObjects = filteredVisibleObjects.concat(netatmoStation, netatmoIndoorProbe, netatmoOutdoorProbe, netatmoRainGauge, netatmoWindGauge,scenarios)

    const idsToNumber = (list)=>{
      const result = list.reduce((r,v,i)=>{
        r.push(Number(v))
        return r;
      },[])
      console.log("RESULT :", result)
      return result;
    }

  const [selection, setSelection] = useState([])
  const [selectable, setSelectable] = useState(selectableObjects||[])

  console.log("SELECTABLE :", selectable)

    const goBack = () => {

        navigation.goBack();
    }

// useEffect(()=> {

// },[objectsVisible]);


useEffect(()=> {
  const getUserFavItems = async()=>{
    const favs = await AsyncStorage.getItem('@userFav');
    console.log("LOCAL_STORAGE :", favs)
   const favsIntParse = favs!=null ? JSON.parse(favs):[]
    console.log('MY_FAVS :', favsIntParse );
    setSelection(favsIntParse)
  }

  getUserFavItems()
},[]);

// useEffect(()=> {

// },[selection]);



    // set Item to local storage method
    const setItemToLocal = async (value) => {
        try {
            await AsyncStorage.setItem('@userFav',JSON.stringify(value))
            dispatch(appRefresh());
        } catch (error) {
          // Error saving data
        }
      };

      // Remove Item to storage
      const removeItemToStorage = async (name) => {
        try {
          await AsyncStorage.removeItem(name);
        } catch (error) {
          console.log(error);
        }
      };


    const submitMe = async() => {
        console.log("RDEPSSSSSSSS :", selection);
        const remove = await removeItemToStorage('@userFav')
        console.log("REMOVE :", remove)
        if(selection.length != 0){
          console.log("SHOW_SELECTION :", selection)
          dispatch(userAddFovorite(selection))
        }else{
          dispatch(userRemoveFavorite())
        }
        setTimeout(()=>{
          setItemToLocal(selection);
        },500)
        navigation.navigate('productsScreen');
    }

    const onItemClick = (id)=>{
      //console.log("ITEM CLICKED CALL BACK_INFINITE_RENDER :", id, selection)
      const position = selection?.indexOf(id)
      console.log("IN THERE :", position)
    
      if(position ==-1){
        setSelection([...selection,id])
      }else{
        let newSelection = [...selection]
        newSelection.splice(position,1);
        setSelection(newSelection)
      }
    
    
    }

    return(
          <SafeAreaView style={{height:'100%', backgroundColor:'white' || bgcolor}} >
              <StatusBar no_hidden={true} barStyle="dark-content"/>
          

              <View style={{flex:1, backgroundColor:'white',}}>

                  <View style={{backgroundColor:'transparent' || headerBgColor, alignItems:'center',justifyContent:'flex-end'}}>
                      <HeaderWithBack
                          //title={uObject.name}
                          title={t(tns + ":" + "SETTING_FAVORITE_HEADER")}
                          backSVG centered
                          goBack={{ action: goBack }}
                          noShadow    
                      />
                  </View>
                
                  <ScrollView style={{height:'100%', backgroundColor:bgcolor, width:'100%', paddingHorizontal:5}} showsVerticalScrollIndicator={false}>
                  {selectable.length !=0 &&
                  <>
                      <View style={{ 
                        flex:4, width:'100%', borderWidth:1,borderRadius:12, justifyContent:'center',padding:5,marginTop:20,
                        backgroundColor:Containerbgcolor, 
                        borderColor:borderColor,
                        
                      }}>
                            <View style={{marginBottom:20, marginTop:10}}>
                                <Text style={{fontSize:16, fontWeight:'400', color:textColor, textAlign:'center'}}>
                                    {t(tns + ":" + "SETTING_FAVORITE_DESCRIP")}
                                </Text>
                            </View>

                            <RenderToogleFlatList 
                                numColumns = {4}
                                iconSize={30}
                                isRedirectOnSelect = {false}
                                forcePadding = {0}
                                //objectId={listItemId}
                                selectable = {selectable}
                                callBack ={onItemClick}
                                selection = {selection}// used as preselected item 
                                bgColor = "#3E495E"
                                iconColor = "#FFFFFF"
                                />
                            
                        <View style={styles.validateButton}>
                                <Button onPress={submitMe}  title={t(tns+":"+"END")} titleColor="#FFFFFF" bgColor="#3E495E" noBorder />
                        </View>
                      </View>
                      </>
                    }
                  </ScrollView>
              </View>
            </SafeAreaView> 
    )
}

const styles = StyleSheet.create({
    headerStyle:{
        justifyContent:'center',
        alignItems:'stretch',
        borderBottomWidth:2,
        marginBottom:0,
      },
    containerWrapper: {
        flexDirection: 'column',
        backgroundColor: 'red',
    },
    validateButton: {
        color:"#FFFFFF",
        height: 50,
        justifyContent:'center',
        alignSelf:'center',
        width:'70%',
        marginTop:20,
        marginBottom:20,
    },
})