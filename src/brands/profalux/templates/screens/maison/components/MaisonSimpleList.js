import React from 'react';
import { useState, useContext, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { View, TouchableOpacity, StyleSheet, FlatList, Dimensions } from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '_theming/themeProvider';
import { AppConfig } from '_config';
import PureItemRender from '_components/list/pureItemRender/pureItemRender';
import ObjectModal from '_components/ui/objetModal';
import { setOrderedList } from '_services/storage';

import { getAllObjects, getTypeNameObjects, getObjectsByTypes, getObjectsVisible } from '_helpers/selectors';
import { focusAddedProduct } from '_actions/app';

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

const screenWidth = Dimensions.get('window').width;

export const MaisonSimpleList = React.memo(props => {


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

  useEffect(()=> {
    console.log("MaisonSimpleList netInfoIsConnected ::",netInfoIsConnected)
  },[netInfoIsConnected]);

  // console.log("gloIsConnected",gloIsConnected,"gloServerIsDown",gloServerIsDown,"netInfoIsConnected",netInfoIsConnected)
  // never do this again (below) kept here for learning from your mistakes purpose
  //const netInfoIsConnected = (useSelector(state=> state?.network?.isConnected) == true && useSelector(state=> state?.network?.serverIsDown == false))


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



  const listTypeHarold = ["Shutter", "GarageDoor", "ToggleGate", "Gate", "ToggleGara", "Gate", "ToggleGarageDoor", "TriggerGate"];
  const getOtherObjectVisible = listTypeHarold.reduce((r, v, i) => {
    if (objectsTypes[v]) r.push(...objectsTypes[v]);
    return r;
  }, [])


  //console.log("TEST :", getOtherObjectVisible)


  const LightsVisible = ["Light", "Sonde", "Application","Scenario"].reduce((r, v, i) => {
    if (objectsTypes[v]) r.push(...objectsTypes[v]);
    return r;
  }, [])

  useEffect(() => {
    //console.log("OBJECT VISIBLE :", objectsVisible)
    const group = objectsTypes["Composite"] || [];
    const sourceFiltered = source.filter(item => !group?.includes(item));

    const halfWidget = sourceFiltered.filter(item => LightsVisible?.includes(item));
    const fullWidget = sourceFiltered.filter(item => getOtherObjectVisible?.includes(item));
    //const otherObjectVisiblePresent = source.filter(item => getOtherObjectVisible?.includes(item));

    setDataFiltered(sourceFiltered)
    setLightsPresent(halfWidget);
    setOtherObjectVisiblePresent(fullWidget)
  }, [source])

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


  //console.log("maintenanceNeeded",maintenanceNeeded)

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


    let key = "key_" + item;
    if (img.indexOf('getfile') != -1) img = 'weather.svg';
    const activeDragColor = theme.primary || 'green'
    const activeStyle = { elevation: 5, shadowColor: "#000", shadowOffset: { width: 0, height: 2, }, shadowOpacity: 0.25, shadowRadius: 3.84, backgroundColor: activeDragColor };


    console.log("so rerenderItemmmm",netInfoIsConnected)




    let content;
    if (typeName != 'composite') {
      content =
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
    } else { content = null }
    return content;
  }

  // Harold : ic item = itemId
  const renderItemHalf = ({ item, index, drag, isActive, halfCard }) => {

    // FIRST CHECK IF item is in objects
    // because it can possibly have been removed
    // and it raise an error if this test is not present
    if (allObjects[item] == undefined) return null;
   console.log(">>>> reREnder",item)
    let { title, type, img, typeName } = getObjectDatas(item);

    // Appium testing  
    const automatedTestId = typeName + "_" + typeNameObjects?.[typeName]?.indexOf(item);


    let key = "key_" + item;
    if (img.indexOf('getfile') != -1) img = 'weather.svg';
    const activeDragColor = theme.primary || 'green'
    const activeStyle = { elevation: 5, shadowColor: "#000", shadowOffset: { width: 0, height: 2, }, shadowOpacity: 0.25, shadowRadius: 3.84, backgroundColor: activeDragColor };

    const boxWidth = screenWidth - 0.1 * screenWidth / 2;
    const cardWidth = boxWidth / 2 - 5 // combine with marginRight to avoid padding all
    let content;
    if (typeName != 'composite') {
      content =
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
    } else { content = null }
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
}, areEqual)

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