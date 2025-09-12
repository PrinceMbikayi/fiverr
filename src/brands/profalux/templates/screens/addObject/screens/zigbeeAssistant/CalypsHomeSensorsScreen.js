import '_brand/templates/screens/addObject/locales'
import React,{ useState,useRef, useEffect } from 'react';
import { View,Text,StyleSheet,SafeAreaView, ActivityIndicator, Dimensions} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation, useRoute, StackActions} from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { WebView } from 'react-native-webview';

import PagerView from 'react-native-pager-view';
import { useTheme } from '_theming/themeProvider';
import Button from '_brand/templates/components/ui/Button';
import { getLoadedObjects} from '_helpers/selectors';
import { Body } from  '_brand/templates/screens/addObject/components/Body';
import { HeaderScreen } from  '_brand/templates/screens/addObject/components/HeaderScreen';
import { CardImageArrow } from '_brand/templates/screens/addObject/components/addBoxComponents/CardImageArrow';
import {CommonObjectSettings} from '_brand/templates/components/objects/shutters/components/CommonObjectSettings'
import { MyButton } from '_brand/templates/components/ui/MyButton';
import {getObjectsByTypeName, getObjectsVisible} from '_helpers/selectors';
import {getObjectById} from '_helpers/objects';
import { ModifyNewAddedObject } from '_brand/templates/screens/addObject/components/ModifyNewAddedObject';



const width = Dimensions.get('window').width;
export const CalypsHomeSensorsScreen = () => {
    const pagerRef = useRef(null);
    const currentPageRef = useRef(0)
    let timerRef = useRef(null)

    const dispatch = useDispatch();
    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {};
    const { t, i18n } = useTranslation();
    const tns = "addObject";


    const [allStates, setAllStates] = useState({currentPage:0});
    const [showModifyScreen, setShowModifyScreen] = useState(false);
    const [itemId, setItemId] = useState();
    const [loading, setLoading] = useState(false);
     const [objectFound, setObjectFound] = useState(false)


    const {theme} = useTheme();  

    const testColor = theme?.onBody||'yellow';
    const borderColor = theme?.prflxBorderColor||'orange';
    const bgWhitecolor = theme?.prflxContaintBgColor||'white';
    const bgcolor = theme?.prflxbgColor||'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor||"white";
    const textColor = theme?.prflxTextColor||'black'

    //-------- Scan for dongle and object type name-------
    const whichDongle = "Zigbee_EZSP" // "Profalux"
    const dongleList = useSelector(state => getObjectsByTypeName(state, whichDongle));


    const loadObjects =  useSelector(getLoadedObjects);
    const objectVisible = useSelector(getObjectsVisible)

    // ---------------------

    //const storeShutter868Ref = useRef(JSON.stringify(loadShutter868));
    const initialLoadObjectsRef = useRef(JSON.stringify(objectVisible));
    const updateStateDongleRef = useRef(JSON.stringify(dongleList));



        ////####----------Begin managing Pager View navigation

        console.log("currentPage changed",allStates.currentPage)

        const updateState = (newStates) => {
            setAllStates({allStates,...newStates});
       }
    
       const goBack = (index) => {
        //console.log("currentPage=",allStates.currentPage,currentPageRef.current)
       
        const nextIndex = currentPageRef.current - 1; 
        currentPageRef.current = nextIndex;
        //console.log("in Go Back",nextIndex)
        if(nextIndex < 0 ) {
           // navigation.goBack(2);
            navigation.goBack();
        } else {           
            updateState({'currentPage':nextIndex});         
            pagerRef.current.setPage(nextIndex); 
        }
        
    };

    
    const goNextPage = () => {
    
        const currentPage = allStates.currentPage;
        
        const nextIndex = currentPage + 1; 
        updateState({"currentPage":nextIndex})      
        pagerRef.current.setPage(nextIndex); 
    }
    
    const goPage = (index) => {
         
        //console.log("goPage",index)
        //setCurrentPage(index); 
        const currentPage = allStates.currentPage;
    
        currentPageRef.current = index;
        updateState({"currentPage":index})           
        if(pagerRef.current)pagerRef.current.setPage(index);    ; 
    }
    
    const onPageSelected = (e) => {
           
        const position = e.nativeEvent.position;
        const index = updateState({"currentPage":position})       
        currentPageRef.current = position;     
    }
    
    
    
////####-------------End managing Pager View navigation



useEffect(()=> {
    console.log("NEW_SENSOR :", itemId)
},[itemId]);
const idDongle = dongleList?.[dongleList?.length-1];

useEffect(()=> {
    console.log("DONGLE LIST XXX:", dongleList)
},[dongleList]);

useEffect(()=> {

},[loading]);

useEffect(()=> {

},[showModifyScreen]);

    // ################ PLATINE
const validateSensorJoinNetwork = async()=>{
    //Need to capture the new object Id
    setLoading(true);
    goPage(1)
    timerRef.current = setTimeout(() => {
        setObjectFound(false)
        setLoading(false)
        setShowModifyScreen(true)
        goNextPage();
        clearTimeout(timerRef.current);

    }, 300000) // 5 minutes : default time out for the sensor to be detected must be 180000
}

const modifySensor = ()=>{
    goPage(2)
    //goPage(3)
}


useEffect(() => {
    const initialLoadObjects = JSON.parse(initialLoadObjectsRef.current)
    //const whichNewObject = [35662]
    console.log("OBJECTS VISIBLE  CHANGES :", initialLoadObjects, objectVisible)
    const whichNewObject = objectVisible.filter(x => !initialLoadObjects?.includes(x));
    console.log("OBJECTS VISIBLE  CHANGES 1:", objectVisible, whichNewObject)

    if (whichNewObject.length != 0) {
        const idObj = whichNewObject[whichNewObject.length - 1] 
        setItemId(idObj);
        const objectData = getObjectById(idObj);
        console.log("Here_JE_SUIS_LA :", objectData);
        setLoading(false)
        setObjectFound(true)
        setShowModifyScreen(true)
        goNextPage();
        clearTimeout(timerRef.current); // If id is caught in time, stop interval time out
    } 
}, [objectVisible]);

useEffect(()=> {
    console.log('SENSOR_FOUND :', objectFound);
},[objectFound]);


const cancelLoading = ()=>{
    clearTimeout(timerRef.current)
    setLoading(false)
    setShowModifyScreen(false)
    goBack()
}

const handleStopScan = ()=>{
    setLoading(false);
    navigation.navigate("ZigbeeAssistantHomeScreen")
}

const handleValidateScan = ()=>{
    setLoading(false);
    navigation.navigate("ZigbeeAssistantHomeScreen")
}


    const handleCallBack = () => {
        navigation.dispatch(StackActions.popToTop())
        navigation.navigate("AddObject")
        navigation.navigate("MaisonScreen")

                // pagerRef.current?.setPage(0)
                // // Reset SolarAssistantStack to initial route = SolarAssistantHomeScreen
                // navigation.popToTop()
                // //Reset AddObjectStack to initial route = AddObject
                // navigation.dispatch({
                //     ...CommonActions.reset({
                //       index: 0,
                //       routes: [{ name: "AddObject" }]
                //     })
                //   });

    }


//###################
  
      return (
        <SafeAreaView style={{height:'100%', backgroundColor:'transparent'}}>

            <PagerView 
                style={[{flex:1, backgroundColor:bgcolor}]} 
                ref={pagerRef}
                initialPage={0}
                scrollEnabled={false}
                onPageSelected={onPageSelected}
                // onPageScroll={(e) => console.log(e)}
                //onPageScrollStateChanged={(e) => console.log(e)}
                        >

                            <View key='0' style={{alignItems:'center', justifyContent:'flex-start', backgroundColor:'transparent', paddingTop:20}}>
                                <HeaderScreen title =  {t(tns+":"+"ADD_STELLA_SENSOR")}  goBack={()=>navigation.navigate("ZigbeeAssistantHomeScreen")}/>
                                <Body style={{marginTop:0, padding:15}}>
                                    <View style={{marginTop:0, marginBottom:0}}>
                                        <Text style={styles.text}>
                                            {t(tns+":"+"SENSOR_MAGNET_TILL_ORANGE")}
                                        </Text>
                                    </View>
                                    
                                    <View>
                                        <CardImageArrow 
                                                //onPressNextArrow = {()=>goPage(10)}
                                                borderWidth = {250}
                                                withNextArrow = {false}
                                                imgStyle = {{width: 130, height:105,marginLeft:0}}
                                                imageSource = {require('_brand/templates/screens/addObject/images/sensor123.png')}
                                                //imageSource = {require('_brand/templates/screens/addObject/images/capteurRougeFixe.png')}
                                                innerWidthPercent={'70%'}
                                        />
                                    </View>
                                    <View style={{ marginTop: 0, marginBottom: 0 }}>
                                        <Text style={{marginVertical:2, fontStyle:'italic', color:textColor}}>
                                            1 - {t(tns + ":" + "NOT_FLASHING_ORANGE")}
                                        </Text>
                                        <Text style={{marginVertical:2, fontStyle:'italic', color:textColor}}>
                                            2 - {t(tns + ":" + "MAGNET_AREA")}
                                        </Text>
                                        <Text style={{marginVertical:2, fontStyle:'italic', color:textColor}}>
                                            3 - {t(tns + ":" + "MAGNET")}
                                        </Text>
                                    </View>

                                    <View style={{marginTop:0, marginBottom:0}}>
                                        <Text style={styles.text}>
                                            {t(tns+":"+"SENSOR_JOIN_NETWOR_DESCRIP")}
                                        </Text>
                                    </View>

                                    <View>
                                        <CardImageArrow 
                                                //onPressNextArrow = {()=>goPage(10)}
                                                borderWidth = {250}
                                                withNextArrow = {false}
                                                imgStyle = {{width: 130, height:105, marginLeft:0}}
                                                imageSource = {require('_brand/templates/screens/addObject/images/sensor1.png')}
                                                //imageSource = {require('_brand/templates/screens/addObject/images/capteurClignote.png')}
                                                innerWidthPercent={'70%'}
                                        />
                                    </View>
                                    <View style={{ marginTop: 0, marginBottom: 0 }}>
                                        <Text style={{marginVertical:2, fontStyle:'italic', color:textColor}}>
                                            1 - {t(tns + ":" + "FLASHIN_LIGHT_IF_OK")}
                                        </Text>
                                    </View>
                                    <View style={{marginTop:0, marginBottom:0}}>
                                        <Text style={styles.text}>
                                            {t(tns+":"+"OPEN_ZIGBEE_NETWORK_EFFECT")}
                                        </Text>
                                    </View>


                                    <View style={[styles.validateButton, {color:textColor, marginTop:0}]}>
                                        <Button onPress={validateSensorJoinNetwork} altStyle titleColor='white' title={t(tns+":"+"VALIDATE")} bgColor={textColor} noBorder />
                                    </View>
                                </Body>
                            </View>

                            <View key='1' style={{ alignItems: 'center', justifyContent: 'flex-start', backgroundColor: 'transparent', paddingTop: 20 }}>
                                <HeaderScreen title={t(tns + ":" + "SCAN_FOR_SENSOR")} goBack={cancelLoading} />
                                <Body>
                                    {loading ?
                                        <View style={{ marginTop: 40 }}>
                                        <Text style={[styles.text, { marginTop: 0, marginBottom: 100 }]}>
                                            {t(tns + ":" + "DETECTION_PROCESS")}
                                        </Text>
                                        <ActivityIndicator size="large" color='#3E495E' style={{ transform: [{ scaleX: 3 }, { scaleY: 3 }] }} />
                                        <View style={{ minWidth: 200, marginTop: 100 }}>
                                            <MyButton onPress={handleStopScan} title={t(tns + ":" + "CANCEL")} />
                                        </View>
                                        </View>

                                        :
                                        <View>
                                            {objectFound?
                                                <View style={{ minWidth: 200, marginTop: 60 }}>
                                                    <Text style={[styles.text, { marginTop: 0, marginBottom: 100 }]}>
                                                        {t(tns + ":" + "SENSOR_DETECTED")}
                                                    </Text>
                                                    <MyButton onPress={handleValidateScan} title={t(tns + ":" + "VALIDATE")} />
                                                </View>
                                                :
                                                <View style={{ minWidth: 200, marginTop: 60 }}>
                                                    <Text style={[styles.text, { marginTop: 0, marginBottom: 100 }]}>
                                                        {t(tns + ":" + "SENSOR_NOT_FOUND")}
                                                    </Text>
                                                    <MyButton onPress={handleValidateScan} title={t(tns + ":" + "RETURN")} />
                                                </View>
                                            }

                                        </View>
                                    }
                                </Body>
                            </View>

                            <View key='2' style={{ flex:1, alignItems: 'center', justifyContent: 'flex-start', backgroundColor: 'transparent', paddingTop: 20 }}>
                                <HeaderScreen title={t(tns + ":" + "ADD_STELLA_SENSOR")} goBack={()=>{goPage(0)}} />
                                <Body style={{margin:10, backgroundColor:'green'}}>
                                    {(showModifyScreen && typeof (itemId) == "number") &&
                                        <View style={{ width: width - 5 }}>
                                            {/* <CommonObjectSettings newAddedItemId={itemId} goHome="MaisonScreen" noHeader={true} /> */}
                                            <ModifyNewAddedObject itemId={itemId} callBackSetPage={handleCallBack} />
                                        </View>
                                    }
                                </Body>
                            </View>



            </PagerView>
        </SafeAreaView>
   
        )
};


const styles = StyleSheet.create({
        text:{
            fontSize:16,
            fontWeight:'400',
            alignItems:'center',
            justifyContent:'center',
            textAlign:'center',
            flexWrap:'wrap',
            lineHeight:20,
            marginVertical:10,
            color:'#3E495E'
        },
        validateButton:{
            minWidth:200,
            height:50,
            marginTop:50,
        },
        inerStyle:{
            marginLeft:10
        }
  });
