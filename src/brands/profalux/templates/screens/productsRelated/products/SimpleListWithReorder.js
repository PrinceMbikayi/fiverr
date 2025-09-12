import "_brand/templates/screens/productsRelated/products/locales"
import React from 'react';
import { useState,useEffect,useRef } from 'react';
import { useSelector, useDispatch} from "react-redux";
import {View,TouchableOpacity,StyleSheet,FlatList,Text, Dimensions} from 'react-native';

import { useNavigation,useRoute} from '@react-navigation/native';
import { useTheme } from '_theming/themeProvider';
import { AppConfig } from '_config';
import PureItemRender from '_components/list/pureItemRender/pureItemRender';
import ObjectModal from '_components/ui/objetModal';
import {getOrderedList,setOrderedList} from '_services/storage';

import {getAllObjects,getTypeNameObjects,getObjectsByTypes} from '_helpers/selectors';
import {focusAddedProduct} from '_actions/app';

import { NestableScrollContainer, NestableDraggableFlatList } from "react-native-draggable-flatlist"

import { useTranslation } from 'react-i18next';
import { alphabeticSort } from '_brand/utils/alphabeticSort';


 const areEqual = (prevProps, nextProps) => {
  
  //console.log("Memo areEqual",prevProps,nextProps)

  const prev = prevProps.source.join("-");
  const next = nextProps.source.join("-");
  const pMaintenance = prevProps.maintenanceNeeded;
  const nMaintenance = nextProps.maintenanceNeeded;
  const noReRender = (prev === next && pMaintenance === nMaintenance)
  //console.log("-------> areEqual SimpleListWithReorder",noReRender,prev,next); 
  return noReRender;
  // no render -> return true;
}

const screenWidth = Dimensions.get('window').width;

export const SimpleListWithReorder = React.memo(props => {

    const { t, i18n } = useTranslation();
    const tns = "products"
    const objectModalRef = useRef()


    const [flatList,setFlatList] = useState(null)
    const {source,itemExpandMore,listId,productJustAdded,maintenanceNeeded} = props;
    const [data,setData] = useState(source);

    const {theme} = useTheme();  
      const textColor = theme?.prflxTextColor||'black'

    //Harold addition
    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {}; 
    
    const gloIsConnected = useSelector(state=> state?.network?.isConnected);
    const gloServerIsDown = useSelector(state=> state?.network?.serverIsDown);
    //const netInfoIsConnected = (gloServerIsDown == false);
    const netInfoIsConnected = (gloIsConnected == true && gloServerIsDown == false);


    useEffect(()=> {
    console.log("netInfoIsConnected ======>",netInfoIsConnected)
    },[netInfoIsConnected]);
    // console.log("gloIsConnected",gloIsConnected,"gloServerIsDown",gloServerIsDown,"netInfoIsConnected",netInfoIsConnected)
    // never do this again (below) kept here for learning from your mistakes purpose
    //const netInfoIsConnected = (useSelector(state=> state?.network?.isConnected) == true && useSelector(state=> state?.network?.serverIsDown == false))


    const allObjects = useSelector(getAllObjects)||[];
    const typeNameObjects = useSelector(getTypeNameObjects)
    const otherHandlers = useSelector(state => state.app.simultaneaousPanResponder)

    const dispatch = useDispatch(); 

    const getObjectDatas = (itemId) => (
                    {  
                        title   : getObjectProp(itemId,'name'),
                        type    : getObjectProp(itemId,AppConfig.OBJECT_TYPE_VARNAME),
                        typeName    : getObjectProp(itemId,'typeName'),
                        img     : getObjectProp(itemId,'img')
                    }
                )

    let lst = [];

    const objectsTypes = useSelector(getObjectsByTypes);

    const listTypeHarold = ["Shutter","GarageDoor", "ToggleGate", "Gate", "ToggleGara","Gate","ToggleGarageDoor", "TriggerGate"];
    const getOtherObjectVisible = listTypeHarold.reduce((r,v,i)=>{
      if(objectsTypes[v]) r.push(...objectsTypes[v]);
      return r;
    }, [])

   
    const LightsVisible  = ["Light", "Sonde","Scenario", "Application"].reduce((r,v,i)=>{
      console.log('LIGHT_VISIBLE_REDRAW :');
      if(objectsTypes[v]) r.push(...objectsTypes[v]);
      return r;
    }, [])

    // const ShuttersVisible = useSelector(getObjectsByTypes)["Shutter"];

    
    const halfWidgetData = source.filter(item => LightsVisible?.includes(item));
    console.log('SOURCE :', LightsVisible);
    //const ShuttersPresent = source.filter(item => ShuttersVisible?.includes(item));
    const entireWidgetData = source.filter(item => getOtherObjectVisible?.includes(item));
    
    const halfWidgetSorted = useRef([])
    const EntireWidgetSorted = useRef([])

    useEffect(()=> {
      console.log(" LIGHTS_CLASS_OBJECTS :", halfWidgetData)
      const halfWidgetList = alphabeticSort(halfWidgetData)
      const entireWidgetList = alphabeticSort(entireWidgetData)
      
      halfWidgetSorted.current = halfWidgetList
      EntireWidgetSorted.current = entireWidgetList
      console.log(" HALF_OBJECTS :",  halfWidgetSorted.current)
    },[halfWidgetData, entireWidgetData]);

    useEffect(() => {     
        const cleanedSource = source.reduce((r,v,i) => {      
          if(allObjects[v] != undefined)r.push(v)
          return r
        },[]);      
        setData(cleanedSource)
    }, [source]);

    useEffect(() => {
      //console.log("otherHandlers",otherHandlers)
    
    },[otherHandlers])

    // useEffect(() => {
    //   if(productJustAdded == true) {
    //     if(flatList) {
    //       //flatList.current._component.scrollToEnd()
    //       flatList.current._component.scrollToOffset(0)
    //     }
    //     dispatch(focusAddedProduct(false))
    //   }
    // },[props.productJustAdded])

      const getObjectProp = (itemId,prop) => {
      
          var retVal = allObjects[itemId][prop];
          if(Array.isArray(retVal)) return retVal;
          if(prop == 'statusesActiveImages')return []
          return ''+( retVal != undefined? retVal : '');
      }


// Harold : ic item = itemId
const renderItem = ({ item, index, drag, isActive, halfCard }) => {

  // FIRST CHECK IF item is in objects
  // because it can possibly have been removed
  // and it raise an error if this test is not present
  if(allObjects[item] == undefined)return null;  
    // ATTENTION RENDER console.log(">>>> reREnder",item)
   let {title,type,img,typeName} = getObjectDatas(item);   

    // Appium testing  
    const automatedTestId = typeName+"_"+typeNameObjects?.[typeName]?.indexOf(item);


    let key = "key_"+item;
    if(img.indexOf('getfile')!=-1)img='weather.svg';
    const activeDragColor = theme.primary || 'green'
    const activeStyle = { elevation:5,shadowColor: "#000", shadowOffset: { width: 0, height: 2,},shadowOpacity: 0.25, shadowRadius: 3.84, backgroundColor:activeDragColor  };
  
      return (

        
        <View key={key}>
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
      )
  }

// Harold : ic item = itemId
const renderItemHalf = ({ item, index, drag, isActive, halfCard }) => {

  // FIRST CHECK IF item is in objects
  // because it can possibly have been removed
  // and it raise an error if this test is not present
  console.log('RET :', item);
  if(allObjects[item] == undefined)return null;  
   let {title,type,img,typeName} = getObjectDatas(item);   

    // Appium testing  
    const automatedTestId = typeName+"_"+typeNameObjects?.[typeName]?.indexOf(item);


    let key = "key_"+item;
    if(img.indexOf('getfile')!=-1)img='weather.svg';
    const activeDragColor = theme.primary || 'green'
    const activeStyle = { elevation:5,shadowColor: "#000", shadowOffset: { width: 0, height: 2,},shadowOpacity: 0.25, shadowRadius: 3.84, backgroundColor:activeDragColor  };

    const boxWidth = screenWidth - 0.1*screenWidth/2;
    const cardWidth = boxWidth/2 -5 // combine with marginRight to avoid padding all
      return (

        
        <View key={key} style={{width:cardWidth,backgroundColor:'transparent',marginRight:5, alignItems: 'stretch',flex:0.5,}}>
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
      )
  }


  const renderPlaceHolder = () => {
        return (
          <View style={{backgroundColor:'blue'}}/>           
         
        )
  }

  const updateOrder = async(data) => {
    // console.log(listId,'endDrag',data);
    setData(data);
    const addList = await setOrderedList(listId,data)
  }

    return (
       
       <View style={{backgroundColor:'transparent', paddingVertical:10,}}> 
      
        <NestableScrollContainer showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
            <View style={{backgroundColor:'transparent',  marginBottom:0, padding:0,}}>
              {
                (halfWidgetData.length > 0 || entireWidgetData.length >0)  &&
                <Text style={{fontSize:22, color:textColor, fontWeight:'600'}}>{t(tns+":"+"EQUIPMENTS")}</Text>
              }
              <View style={{marginVertical:0,backgroundColor:'transparent', flex:1, justifyContent:'space-between'}}>
                  <FlatList
                    data={halfWidgetSorted.current}
                    renderItem={renderItemHalf}
                    numColumns={2}
                    keyExtractor={(item, index) => "key_"+item}
                    onDragEnd={({ data }) => { updateOrder(data);}}
                    removeClippedSubviews={false}  
                    windowSize={21}//80 before
                    renderPlaceholder = {renderPlaceHolder}
                    //onRef={(myList) => setFlatList(myList)}
                    scrollEnabled={true}
                    simultaneousHandlers={otherHandlers}
                  /> 
              </View>

              <View style={{marginTop:0}}>
                  <FlatList
                    data={entireWidgetData}
                    renderItem={renderItem}
                    numColumns={1}
                    keyExtractor={(item, index) => "key_"+item}
                    onDragEnd={({ data }) => { updateOrder(data);}}
                    removeClippedSubviews={false}  
                    windowSize={21}//80
                    renderPlaceholder = {renderPlaceHolder}
                    //onRef={(myList) => setFlatList(myList)}
                    scrollEnabled={true}
                    simultaneousHandlers={otherHandlers}
                  />
              </View>

            </View>

        </NestableScrollContainer>
      </View>   
    )
},areEqual)

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