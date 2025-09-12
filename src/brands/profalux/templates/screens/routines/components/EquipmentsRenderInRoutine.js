import React from 'react';
import { useState,useEffect, useRef } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { View, TouchableOpacity, StyleSheet, FlatList, Text, Dimensions } from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '_theming/themeProvider';
import { AppConfig } from '_config';
//import PureItemRender from '_components/list/pureItemRender/pureItemRender';
import PureItemRoutineRender from '_brand/templates/screens/routines/components/pureItemRoutineRender';
import ObjectModal from '_components/ui/objetModal';
import { setOrderedList } from '_services/storage';

import { getAllObjects, getTypeNameObjects, getObjectsByTypes, getObjectsVisible } from '_helpers/selectors';
import { focusAddedProduct } from '_actions/app';

import { NestableScrollContainer, NestableDraggableFlatList } from "react-native-draggable-flatlist"
import { getObjectById } from '_helpers/objects';

// import Maintenance from '_components/objects/boardgate/maintenance';


const screenWidth = Dimensions.get('window').width;

export const EquipmentsRenderInRoutine = (props) => {


  console.log("EQUIPS_PROPS :", props)
  const objectModalRef = useRef()

  const [LightsPresent, setLightsPresent] = useState([]);
  const [otherObjectVisiblePresent, setOtherObjectVisiblePresent] = useState([])
  const [dataFiltered, setDataFiltered] = useState([])

  const [flatList, setFlatList] = useState(null)
  const { source, itemExpandMore, listId, productJustAdded, maintenanceNeeded } = props;
  const [data, setData] = useState(source);

  //Harold addition
  const navigation = useNavigation();
  const route = useRoute();
  const navigationParams = route?.params || {};

  const gloIsConnected = useSelector(state => state?.network?.isConnected);
  const gloServerIsDown = useSelector(state => state?.network?.serverIsDown);
  //const netInfoIsConnected = (gloServerIsDown == false);
  const netInfoIsConnected = (gloIsConnected == true && gloServerIsDown == false);
  
  const allObjects = useSelector(getAllObjects);
  const objectsVisible = useSelector(getObjectsVisible);
  const typeNameObjects = useSelector(getTypeNameObjects)
  const otherHandlers = useSelector(state => state.app.simultaneaousPanResponder)

  const dispatch = useDispatch();
  const { theme } = useTheme();

  const getObjectDatas = (itemId) => (
    {
      title: getObjectProp(itemId, 'name'),
      type: getObjectProp(itemId, AppConfig.OBJECT_TYPE_VARNAME),
      typeName: getObjectProp(itemId, 'typeName'),
      img: getObjectProp(itemId, 'img')
    }
  )

  const objectsTypes = useSelector(getObjectsByTypes);


  //Harold: "Composite" Added on : 04/10/2024 in order to allow Scenario to show Groups
  const listTypeHarold = ["Composite", "Shutter", "GarageDoor", "ToggleGate", "Gate", "ToggleGara", "Gate", "ToggleGarageDoor"];
  const getOtherObjectVisible = listTypeHarold.reduce((r, v, i) => {
    if (objectsTypes[v]) r.push(...objectsTypes[v]);
    return r;
  }, [])


  //console.log("TEST :", getOtherObjectVisible)

  //Harold: "Composite" Added on : 04/10/2024 in order to allow Scenario to show Groups
  const LightsVisible = ["Light", "Sonde", "Composite"].reduce((r, v, i) => {
    if (objectsTypes[v]) r.push(...objectsTypes[v]);
    return r;
  }, [])

  useEffect(() => {
    //console.log("OBJECT VISIBLE :", objectsVisible)
    const group = objectsTypes["Composite"] || [];

    // Harold : test remove filter on "source" on : 04/10/2024 in order to allow Scenario to show Groups
    const sourceFiltered = source//.filter(item => !group?.includes(item));

    const halfWidget = sourceFiltered.filter(item => LightsVisible?.includes(item));
    const fullWidget = sourceFiltered.filter(item => getOtherObjectVisible?.includes(item));
    //const otherObjectVisiblePresent = source.filter(item => getOtherObjectVisible?.includes(item));

    setDataFiltered(sourceFiltered)
    setLightsPresent(halfWidget);
    setOtherObjectVisiblePresent(fullWidget)
  }, [objectsVisible, source])

  useEffect(() => {
    //console.log("otherHandlers",otherHandlers)

  }, [otherHandlers])

  useEffect(() => {
    if (productJustAdded == true) {
      if (flatList) {
        //flatList.current._component.scrollToEnd()
        flatList.current._component.scrollToOffset(0)
      }
      dispatch(focusAddedProduct(false))
    }
  }, [props.productJustAdded])

  const getObjectProp = (itemId, prop) => {

    var retVal = allObjects[itemId][prop];
    if (Array.isArray(retVal)) return retVal;
    if (prop == 'statusesActiveImages') return []
    return '' + (retVal != undefined ? retVal : '');
  }



  // Harold : ic item = itemId
  const renderItem = ({ item, index, drag, isActive, halfCard, isRoutine = true }) => {

    if (allObjects[item] == undefined) return null;
    let { title, type, img, typeName } = getObjectDatas(item);
    const itemDatas = getObjectById(item)
    const traits = itemDatas?.traits
    console.log('COMP_TYPE_FULL:',item, traits, itemDatas);

    // Appium testing  
    const automatedTestId = typeName + "_" + typeNameObjects?.[typeName]?.indexOf(item);


    let key = "key_" + item;
    if (img.indexOf('getfile') != -1) img = 'weather.svg';
    const activeDragColor = theme.primary || 'green'
    const activeStyle = { elevation: 5, shadowColor: "#000", shadowOffset: { width: 0, height: 2, }, shadowOpacity: 0.25, shadowRadius: 3.84, backgroundColor: activeDragColor };

    let content;
    
     //Harold: switch conditional to "traits" on : 04/10/2024 in order to allow Scenario to show Groups full widgets
    //if (typeName != 'composite') {
    if(traits != "OnOff" || !traits.includes("OnOff")){
      content =
        <View key={key}>
          <ObjectModal ref={objectModalRef} />
          <TouchableOpacity activeOpacity={1}
            style={[styles.button, { backgroundColor: isActive ? "transparent" : 'transparent' }, { ...(isActive) ? activeStyle : {} }]}
            onLongPress={drag} delayLongPress={2000}
            touchSoundDisabled={true}
          >
            <PureItemRoutineRender itemId={item}
              style={{ flex: 1 }}
              modal={objectModalRef}
              automatedTestId={automatedTestId}
              netInfoIsConnected={netInfoIsConnected}

            />
          </TouchableOpacity>
        </View>
      }else{content = null}
    //} else { content = null }
    return content;
  }

  // Harold : ic item = itemId
  const routineAction = (action)=>{
    console.log("ROUTINE_ACTION :", action)
  }
  const renderItemHalf = ({ item, index, drag, isActive, halfCard }) => {

    if (allObjects[item] == undefined) return null;
    // ATTENTION RENDER console.log(">>>> reREnder",item)
    let { title, type, img, typeName } = getObjectDatas(item);
    const itemDatas = getObjectById(item)
    const traits = itemDatas?.traits
    console.log('COMP_TYPE :',item, traits);

    // Appium testing  
    const automatedTestId = typeName + "_" + typeNameObjects?.[typeName]?.indexOf(item);


    let key = "key_" + item;
    if (img.indexOf('getfile') != -1) img = 'weather.svg';
    const activeDragColor = theme.primary || 'green'
    const activeStyle = { elevation: 5, shadowColor: "#000", shadowOffset: { width: 0, height: 2, }, shadowOpacity: 0.25, shadowRadius: 3.84, backgroundColor: activeDragColor };

    const boxWidth = screenWidth - 0.1 * screenWidth / 2;
    const cardWidth = boxWidth / 2 - 5 // combine with marginRight to avoid padding all
    let content;

    //Harold: switch conditional to "traits" on : 04/10/2024 in order to allow Scenario to show Groups halph widgets
    //if (typeName != 'composite') {
      if(traits == "OnOff"){
      content =
        <View key={key} style={{ width: cardWidth, backgroundColor: 'transparent', padding: 0, marginRight: 5 }}>
          <ObjectModal ref={objectModalRef} />
          <TouchableOpacity activeOpacity={1}
            style={[styles.button, { backgroundColor: isActive ? "transparent" : 'transparent' }, { ...(isActive) ? activeStyle : {} }]}
            onLongPress={drag} delayLongPress={2000}
            touchSoundDisabled={true}
          >
            <PureItemRoutineRender itemId={item}
              style={{ flex: 1 }}
              modal={objectModalRef}
              automatedTestId={automatedTestId}
              netInfoIsConnected={netInfoIsConnected}
              isRoutine = {routineAction}

            />

            {/* <EquipmentRender id={item}/> */}
          </TouchableOpacity>
        </View>
      }else{content = null}
    //} else { content = null }
    return (
      content
    )
  }


  const renderPlaceHolder = () => {
    return (
      <View style={{ backgroundColor: 'blue' }} />

    )
  }

  const updateOrder = async (data) => {
    // console.log(listId,'endDrag',data);
    setData(data);
    const addList = await setOrderedList(listId, data)
  }


  return (

    <View style={{ backgroundColor: 'transparent', paddingVertical: 0, }}>
      
      <NestableScrollContainer showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        <View style={{ backgroundColor: 'transparent', marginBottom: 0, padding: 0, }}>

          <View style={{ marginTop: 0 }}>
            <FlatList
              data={LightsPresent}
              renderItem={renderItemHalf}
              numColumns={2}
              keyExtractor={(item, index) => "key_" + item}
              onDragEnd={({ data }) => { updateOrder(data); }}
              removeClippedSubviews={false} windowSize={80}
              renderPlaceholder={renderPlaceHolder}
              onRef={(myList) => setFlatList(myList)}
              onContentSizeChange={() => { }}
              scrollEnabled={true}
              simultaneousHandlers={otherHandlers}
              activationDistance={20}
              autoscrollSpeed={1000}
            />
          </View>

          <View style={{ marginTop: 0 }}>
            <NestableDraggableFlatList
              data={otherObjectVisiblePresent}
              renderItem={renderItem}
              numColumns={1}
              keyExtractor={(item, index) => "key_" + item}
              onDragEnd={({ data }) => { updateOrder(data); }}
              removeClippedSubviews={false} windowSize={80}
              renderPlaceholder={renderPlaceHolder}
              onRef={(myList) => setFlatList(myList)}
              onContentSizeChange={() => { }}
              scrollEnabled={true}
              simultaneousHandlers={otherHandlers}
              activationDistance={20}
              autoscrollSpeed={1000}
            />
          </View>

        </View>

      </NestableScrollContainer>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'pink',
    flex: 1
  },
  button: {
    flex: 1,

  },
  buttonText: {
    padding: 20,
    color: 'white'
  }
})