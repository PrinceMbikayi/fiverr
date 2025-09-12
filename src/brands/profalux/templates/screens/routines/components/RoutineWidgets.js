import React from 'react';
import { useState, useContext, useEffect,useRef } from 'react';
import { useSelector, useDispatch} from "react-redux";
import {View,TouchableOpacity,StyleSheet,FlatList,Text, Dimensions} from 'react-native';

import { useNavigation,useRoute } from '@react-navigation/native';
import { useTheme } from '_theming/themeProvider';
import { AppConfig } from '_config';
import PureItemRender from '_components/list/pureItemRender/pureItemRender';
import ObjectModal from '_components/ui/objetModal';

import {getAllObjects,getTypeNameObjects,getObjectsByTypes,getObjectsVisible} from '_helpers/selectors';
import {focusAddedProduct} from '_actions/app';

import { NestableScrollContainer } from "react-native-draggable-flatlist"
import { alphabeticSort } from '_brand/utils/alphabeticSort';



const screenWidth = Dimensions.get('window').width;

export const RoutineWidgets = (props) => {

    const objectModalRef = useRef()
    const [routinePresent, setRoutinePresent]= useState([]);
    const {source} = props;

    //Harold addition
    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {}; 
    
    const gloIsConnected = useSelector(state=> state?.network?.isConnected);
    const gloServerIsDown = useSelector(state=> state?.network?.serverIsDown);
    //const netInfoIsConnected = (gloServerIsDown == false);
    const netInfoIsConnected = (gloIsConnected == true && gloServerIsDown == false);

    // console.log("gloIsConnected",gloIsConnected,"gloServerIsDown",gloServerIsDown,"netInfoIsConnected",netInfoIsConnected)
    // never do this again (below) kept here for learning from your mistakes purpose
    //const netInfoIsConnected = (useSelector(state=> state?.network?.isConnected) == true && useSelector(state=> state?.network?.serverIsDown == false))


    const allObjects = useSelector(getAllObjects);
    const objectsVisible = useSelector(getObjectsVisible);
    const typeNameObjects = useSelector(getTypeNameObjects)

    const dispatch = useDispatch(); 
    const {theme} = useTheme();

    const getObjectDatas = (itemId) => (
                    {  
                        title   : getObjectProp(itemId,'name'),
                        type    : getObjectProp(itemId,AppConfig.OBJECT_TYPE_VARNAME),
                        typeName    : getObjectProp(itemId,'typeName'),
                        img     : getObjectProp(itemId,'img')
                    }
                )

    const objectsTypes = useSelector(getObjectsByTypes);


    const routinesVisible  = ["Scenario","Application"].reduce((r,v,i)=>{
      if(objectsTypes[v]) r.push(...objectsTypes[v]);
      return r;
    }, [])

    useEffect(()=>{

      const halfWidget = source.filter(item => routinesVisible?.includes(item)) ||[];
      const halfWidgetSorted = alphabeticSort(halfWidget)

      setRoutinePresent(halfWidgetSorted);
    },[objectsVisible, source])


      const getObjectProp = (itemId,prop) => {
      
          var retVal = allObjects[itemId][prop];
          if(Array.isArray(retVal)) return retVal;
          if(prop == 'statusesActiveImages')return []
          return ''+( retVal != undefined? retVal : '');
      }



const renderItemHalf = ({ item, index, drag, isActive, halfCard }) => {
  if(allObjects[item] == undefined)return null;  
   let {img,typeName} = getObjectDatas(item);   
   console.log("HERE I VIEW TYPE NAMES :", typeName)
    // Appium testing  
    const automatedTestId = typeName+"_"+typeNameObjects?.[typeName]?.indexOf(item);

    let key = "key_"+item;
    if(img.indexOf('getfile')!=-1)img='weather.svg';
    const activeDragColor = theme.primary || 'green'
    const activeStyle = { elevation:5,shadowColor: "#000", shadowOffset: { width: 0, height: 2,},shadowOpacity: 0.25, shadowRadius: 3.84, backgroundColor:activeDragColor  };

    const boxWidth = screenWidth - 0.1*screenWidth/2;
    const cardWidth = boxWidth/2 -5 // combine with marginRight to avoid padding all
    let content;
    if(typeName != 'composite'){
      content =         
                <View key={key} style={{width:cardWidth,backgroundColor:'transparent',padding:0,marginRight:5}}>
                  <ObjectModal ref={objectModalRef} />
                    <TouchableOpacity activeOpacity={1}
                      style={[styles.button,{backgroundColor: isActive ? "transparent" : 'transparent'},{...(isActive)? activeStyle : {}}]}
                      onLongPress={drag} delayLongPress={2000}
                      touchSoundDisabled={true}
                    >
                        <PureItemRender itemId={item}
                                        style={{flex:1}}
                                        modal={objectModalRef}
                                        automatedTestId={automatedTestId}
                                        netInfoIsConnected={netInfoIsConnected}           

                          />
                      </TouchableOpacity>
                  </View>
    }else{content=null}
      return (
          content
      )
  }


  const renderPlaceHolder = () => {
        return (
          <View style={{backgroundColor:'blue'}}/>           
         
        )
  }



    return (
       
       <View style={{backgroundColor:'transparent', paddingVertical:0,}}> 
      
        <NestableScrollContainer showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
              <View style={{marginTop:0}}>
                  <FlatList
                    data={routinePresent}
                    renderItem={renderItemHalf}
                    numColumns={2}
                    keyExtractor={(item, index) => "key_"+item}
                    removeClippedSubviews={false}  
                    windowSize={10}
                    renderPlaceholder = {renderPlaceHolder}
                    scrollEnabled={true}
                    autoscrollSpeed={1000}
                  /> 
              </View>
        </NestableScrollContainer>
      </View>   
    )
}

const styles = StyleSheet.create({
  container: {
   flexDirection: 'row',
   backgroundColor: 'pink',
   flex:1
  },
  button: {
   flex:1,
  
 },
 buttonText: {
  padding: 20,
  color: 'white'
 }
})