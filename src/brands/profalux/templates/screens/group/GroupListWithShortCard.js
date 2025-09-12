import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { View, TouchableOpacity, StyleSheet, FlatList, Text, Dimensions } from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';

import { useTheme } from '_theming/themeProvider';
import { AppConfig } from '_config';
import PureItemRender from '_components/list/pureItemRender/pureItemRender';
import ObjectModal from '_components/ui/objetModal';
import { setOrderedList } from '_services/storage';

import { getAllObjects, getTypeNameObjects, getObjectsByTypes } from '_helpers/selectors';

import { NestableScrollContainer, NestableDraggableFlatList } from "react-native-draggable-flatlist"

import { getObjectById } from '_helpers/objects';


const screenWidth = Dimensions.get('window').width;

export const GroupListWithShortCard = (props) => {


  const objectModalRef = useRef()


  const [flatList, setFlatList] = useState(null)
  const { sourceHalfCard, sourceFullCard, listId, productJustAdded } = props;
  //const [data,setData] = useState(source);
  const [lightSwitchList, setLightSwitchList] = useState(sourceHalfCard);
  const [otherObjects, setOtherObjects] = useState(sourceFullCard);

  //Harold addition
  const navigation = useNavigation();
  const route = useRoute();
  const navigationParams = route?.params || {};

  const gloIsConnected = useSelector(state => state?.network?.isConnected);
  const gloServerIsDown = useSelector(state => state?.network?.serverIsDown);
  const netInfoIsConnected = (gloIsConnected == true && gloServerIsDown == false);

  const allObjects = useSelector(getAllObjects);
  const typeNameObjects = useSelector(getTypeNameObjects)
  //const otherHandlers = useSelector(state => state.app.simultaneaousPanResponder)

  const dispatch = useDispatch();
  const { theme } = useTheme();

  const getObjectDatas = (itemId) => (
    {
      title: getObjectProp(itemId, 'name'),
      type: getObjectProp(itemId, AppConfig.OBJECT_TYPE_VARNAME),
      typeName: getObjectProp(itemId, 'typeName'),
      img: getObjectProp(itemId, 'img'),
      uniType: getObjectProp(itemId, 'uniType')
    }
  )

  let lst = [];


  const objectsTypes = useSelector(getObjectsByTypes);


  const listTypeHarold = ["Shutter", "Weather", "GarageDoor", "ToggleGate", "Gate", "ToggleGara", "Gate", "ToggleGarageDoor"];
  const getOtherObjectVisible = listTypeHarold.reduce((r, v, i) => {
    if (objectsTypes[v]) r.push(...objectsTypes[v]);
    return r;
  }, [])


  const lightSwitchVisible = ["Light", "SwitchEzsp"].reduce((r, v, i) => {
    if (objectsTypes[v]) r.push(...objectsTypes[v]);
    return r;
  }, [])



  useEffect(() => {

  }, [sourceHalfCard, sourceFullCard, lightSwitchList, otherObjects])

  const getObjectProp = (itemId, prop) => {

    var retVal = allObjects[itemId][prop];
    if (Array.isArray(retVal)) return retVal;
    if (prop == 'statusesActiveImages') return []
    return '' + (retVal != undefined ? retVal : '');
  }


  //console.log("maintenanceNeeded",maintenanceNeeded)
  const ListHeader = () => {
    if (maintenanceNeeded) {
      return (
        <Maintenance />
      )
    } else {
      return null
    }
  }


  // Harold : ic item = itemId
  const renderItem = ({ item, index, drag, isActive, halfCard }) => {

    // FIRST CHECK IF item is in objects
    // because it can possibly have been removed
    // and it raise an error if this test is not present
    if (allObjects[item] == undefined) return null;
    // ATTENTION RENDER console.log(">>>> reREnder",item)
    let { title, type, img, typeName } = getObjectDatas(item);

    // Appium testing  
    const automatedTestId = typeName + "_" + typeNameObjects?.[typeName]?.indexOf(item);
    console.log('GROUPE_TYPENAME :',typeName);


    let key = "key_" + item;
    if (img.indexOf('getfile') != -1) img = 'weather.svg';
    const activeDragColor = theme.primary || 'green'
    const activeStyle = { elevation: 5, shadowColor: "#000", shadowOffset: { width: 0, height: 2, }, shadowOpacity: 0.25, shadowRadius: 3.84, backgroundColor: activeDragColor };
    let content = (
        <View key={key}>
          <ObjectModal ref={objectModalRef} />
          <TouchableOpacity activeOpacity={1}
            style={[styles.button, { backgroundColor: isActive ? "transparent" : 'transparent' }, { ...(isActive) ? activeStyle : {} }]}
            onLongPress={drag} delayLongPress={2000}
            touchSoundDisabled={true}
          >
            <PureItemRender itemId={item}
              style={{ flex: 1 }}
              modal={objectModalRef}
              automatedTestId={automatedTestId}
              netInfoIsConnected={netInfoIsConnected}

            />
          </TouchableOpacity>
      </View>
    )
    return (
     <>
     {typeName =="composite"&&
      <View >
        {content}
      </View>
     }
     </>
    )
  }

  // Harold : ic item = itemId
  const renderItemHalf = ({ item, index, drag, isActive, halfCard }) => {

    // FIRST CHECK IF item is in objects
    // because it can possibly have been removed
    // and it raise an error if this test is not present
    if (allObjects[item] == undefined) return null;
    console.log(">>>> reREnder", getObjectById(item))
    let { title, type, img, typeName, uniType } = getObjectDatas(item);
    console.log(" INNER UNITYPE :", uniType)

    // Appium testing  
    const automatedTestId = typeName + "_" + typeNameObjects?.[typeName]?.indexOf(item);

    const FILTER = ["LightEzsp", "SwitchEzsp"]
    let key = "key_" + item;
    if (img.indexOf('getfile') != -1) img = 'weather.svg';
    const activeDragColor = theme.primary || 'green'
    const activeStyle = { elevation: 5, shadowColor: "#000", shadowOffset: { width: 0, height: 2, }, shadowOpacity: 0.25, shadowRadius: 3.84, backgroundColor: activeDragColor };

    const boxWidth = screenWidth - 0.1 * screenWidth / 2;
    const cardWidth = boxWidth / 2 - 5 // combine with marginRight to avoid padding all
    //console.log("JJJJJJJJJJ :", boxWidth, screenWidth, cardWidth)
    return (

      <View key={key} style={{ width: cardWidth, backgroundColor: 'transparent', padding: 0, marginRight: 5 }}>
        <ObjectModal ref={objectModalRef} />
        <TouchableOpacity activeOpacity={1}
          style={[styles.button, { backgroundColor: isActive ? "transparent" : 'transparent' }, { ...(isActive) ? activeStyle : {} }]}
          onLongPress={drag} delayLongPress={2000}
          touchSoundDisabled={true}
        >
          <PureItemRender itemId={item}
            style={{ flex: 1 }}
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
      <View style={{ backgroundColor: 'blue' }} />

    )
  }

  const updateOrder = async (data) => {
    // console.log(listId,'endDrag',data);
    // setData(data);
    // setLightAndSensor(data)
    // setOtherObjects(data)
    const addList = await setOrderedList(listId, data)
  }


  return (

    <View style={{ backgroundColor: 'transparent', paddingVertical: 10, }}>

      <NestableScrollContainer showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        <View style={{ backgroundColor: 'transparent', marginBottom: 10, padding: 0, }}>
          <View style={{ marginVertical: 0, backgroundColor: 'transparent', flex: 1, justifyContent: 'space-between' }}>
            <FlatList
              data={sourceHalfCard}
              renderItem={renderItemHalf}
              numColumns={2}
              keyExtractor={(item, index) => "key_" + item}
              onDragEnd={({ data }) => { updateOrder(data); }}
              removeClippedSubviews={false} windowSize={80}
              renderPlaceholder={renderPlaceHolder}
              onRef={(myList) => setFlatList(myList)}
              onContentSizeChange={() => { }}
              scrollEnabled={true}
              //simultaneousHandlers={otherHandlers}
              activationDistance={20}
              autoscrollSpeed={1000}
            />
          </View>
          <View style={{ marginTop: 0 }}>
            <NestableDraggableFlatList
              data={sourceFullCard}
              renderItem={renderItem}
              numColumns={1}
              keyExtractor={(item, index) => "key_" + item}
              onDragEnd={({ data }) => { updateOrder(data); }}
              removeClippedSubviews={false} windowSize={80}
              renderPlaceholder={renderPlaceHolder}
              onRef={(myList) => setFlatList(myList)}
              onContentSizeChange={() => { }}
              scrollEnabled={true}
              //simultaneousHandlers={otherHandlers}
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