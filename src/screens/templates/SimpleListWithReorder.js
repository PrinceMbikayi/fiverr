import React from 'react';
import { useState, useContext, useEffect,useRef } from 'react';
import { useSelector, useDispatch} from "react-redux";
import {SafeAreaView,View,TouchableOpacity,StyleSheet,FlatList,Text} from 'react-native';

import { useNavigation,useRoute,StackActions } from '@react-navigation/native';

import DraggableFlatList from "react-native-draggable-flatlist";

import { useTheme } from '_theming/themeProvider';
import { AppConfig } from '_config';
import PureItemRender from '_components/list/pureItemRender/pureItemRender';
import ObjectModal from '_components/ui/objetModal';
import {getOrderedList,setOrderedList} from '_services/storage';

import {getAllObjects,getTypeNameObjects,getObjectsByTypeName,getObjectById,getWidgetReference} from '_helpers/selectors';
import {focusAddedProduct} from '_actions/app';

import { NestableScrollContainer, NestableDraggableFlatList } from "react-native-draggable-flatlist"


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



export const SimpleListWithReorder = React.memo(props => {

   
    const objectModalRef = useRef()


    const [flatList,setFlatList] = useState(null)
    const {source,itemExpandMore,listId,productJustAdded,maintenanceNeeded} = props;
    const [data,setData] = useState(source);
    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {}; 
    
    const gloIsConnected = useSelector(state=> state?.network?.isConnected);
    const gloServerIsDown = useSelector(state=> state?.network?.serverIsDown);
    const netInfoIsConnected = (gloIsConnected == true && gloServerIsDown == false);

    // console.log("gloIsConnected",gloIsConnected,"gloServerIsDown",gloServerIsDown,"netInfoIsConnected",netInfoIsConnected)
    // never do this again (below) kept here for learning from your mistakes purpose
    //const netInfoIsConnected = (useSelector(state=> state?.network?.isConnected) == true && useSelector(state=> state?.network?.serverIsDown == false))


    const allObjects = useSelector(getAllObjects);
    const typeNameObjects = useSelector(getTypeNameObjects)
    const otherHandlers = useSelector(state => state.app.simultaneaousPanResponder)

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

    useEffect(() => {     
        const cleanedSource = source.reduce((r,v,i) => {      
          if(allObjects[v] != undefined)r.push(v)
          return r
        },[]);      
        // console.log(cleanedSource);
        setData(cleanedSource)
    }, [source]);

    useEffect(() => {
      //console.log("otherHandlers",otherHandlers)
    
    },[otherHandlers])

    useEffect(() => {
      if(productJustAdded == true) {
        if(flatList) {
          //flatList.current._component.scrollToEnd()
          flatList.current._component.scrollToOffset(0)
        }
        dispatch(focusAddedProduct(false))
      }
    },[props.productJustAdded])

      const getObjectProp = (itemId,prop) => {
      
          var retVal = allObjects[itemId][prop];
          if(Array.isArray(retVal)) return retVal;
          if(prop == 'statusesActiveImages')return []
          return ''+( retVal != undefined? retVal : '');
      }



// Harold : ic item = itemId
const renderItem = ({ item, index, drag, isActive }) => {

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

  //console.log("MY SOURCE :", source)
  //console.log("MY LIST ID :", listId)

    return (
       
       <View style={{ flex: 1,backgroundColor:'transparent'}}> 
      
       <NestableScrollContainer   showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
          <NestableDraggableFlatList
            data={data}
            renderItem={renderItem}
          
            keyExtractor={(item, index) => "key_"+item}
            onDragEnd={({ data }) => { updateOrder(data);}}
            removeClippedSubviews={false}  windowSize={80}
            renderPlaceholder = {renderPlaceHolder}
            onRef={(myList) => setFlatList(myList)}
            onContentSizeChange={()=>  {}}
            scrollEnabled={true}
            simultaneousHandlers={otherHandlers}
            activationDistance={20}
            autoscrollSpeed={1000}
          />
      </NestableScrollContainer>
      {/*
        <DraggableFlatList  data={data} 
                                  renderItem={renderItem}  
                                  keyExtractor={(item, index) => "key_"+item}
                                  onDragEnd={({ data }) => { updateOrder(data);}}
                                  removeClippedSubviews={false}  windowSize={80}
                                  renderPlaceholder = {renderPlaceHolder}
                                  onRef={(myList) => setFlatList(myList)}
                                  onContentSizeChange={()=>  {}}
                                  scrollEnabled={true}
                                  simultaneousHandlers={otherHandlers}
                                  activationDistance={20}
                                  autoscrollSpeed={1000}
                                 
           
            />
    */}
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