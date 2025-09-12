import '_brand/templates/screens/addObject/locales'
import React,{ useState,useRef, useEffect } from 'react';
import { View,Text,StyleSheet,SafeAreaView, ActivityIndicator, Dimensions} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation, useRoute, StackActions } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import PagerView from 'react-native-pager-view';
import { useTheme } from '_theming/themeProvider';
import Button from '_brand/templates/components/ui/Button';
import { getLoadedObjects} from '_helpers/selectors';
import { Body } from  '_brand/templates/screens/addObject/components/Body';
import { HeaderScreen } from  '_brand/templates/screens/addObject/components/HeaderScreen';
import { CardImageArrow } from '_brand/templates/screens/addObject/components/addBoxComponents/CardImageArrow';
import { MyButton } from '_brand/templates/components/ui/MyButton';
import { TestZigbeeObject } from './components/TestZigbeeObject';
import { ModifyNewAddedObject } from  '_brand/templates/screens/addObject/components/ModifyNewAddedObject';
import {getObjectsByTypeName, getObjectsVisible} from '_helpers/selectors';
import {getObjectById} from '_helpers/objects';
import {Api} from "_api";



const width = Dimensions.get('window').width;
export const ZigbeeReceptorEquipmentsScreen = () => {


    const pagerRef = useRef(null);
    const currentPageRef = useRef(0)

    const dispatch = useDispatch();
    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {};
    const { t, i18n } = useTranslation();
    const tns = "addObject";


    const [allStates, setAllStates] = useState({currentPage:0});
    const [showContent, setShowContent] = useState(false);
    const [showModifyScreen, setShowModifyScreen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [itemId, setItemId] = useState();
    const [chooseTypeNature, setChooseTypeNature] = useState("")
    const [showTestObject, setShowTestObject] = useState(false);
    const [loading, setLoading] = useState(false);
    const [active, setActive] = useState("");
    const [refresh, setRefresh] = useState(0);
    const [integratedOrDeported, setIntegrateOrDeported] = useState("integrated")
    const [typeName, setTypeName] = useState("");
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
    let timerRef = useRef(null)

    // ---------------------

    //const storeShutter868Ref = useRef(JSON.stringify(loadShutter868));
    const initialLoadObjectsRef = useRef(JSON.stringify(objectVisible));



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
    


    const idDongle = dongleList?.[dongleList?.length-1];

    useEffect(()=> {
        console.log("DONGLE LIST XXX:", dongleList)
    },[dongleList]);


useEffect(() => {
    console.log("OBJECTS VISIBLE  CHANGES :", objectVisible)
    const initialLoadObjects = JSON.parse(initialLoadObjectsRef.current)

    const whichNewObject = objectVisible.filter(x => !initialLoadObjects?.includes(x));
    console.log("OBJECTS VISIBLE  CHANGES 1:", objectVisible, whichNewObject)

    if (whichNewObject.length != 0) {
        const idObj = whichNewObject[whichNewObject.length - 1] 
        setItemId(idObj);
        const objectData = getObjectById(idObj);
        console.log("Here_JE_SUIS_LA_TYPENATURE :", objectData?.typeName);
        setLoading(false)
        setObjectFound(true)
        setShowModifyScreen(true)
        //console.log("OBJECT DATA :", objectData?.typeName)
        setTypeName(objectData?.typeName);
        clearTimeout(timerRef.current); // If id is caught in time, stop interval time out
        //goNextPage();
    } 
}, [objectVisible]);


useEffect(() => {

}, [loading]);

useEffect(() => {

}, [objectFound]);

const validateLocalizeButton = async()=>{
    console.log("Open network")
    await Api.executeAction(idDongle, "APPAIRAGE", { oArgs: [{ name: 'duration', value: 2 }] })
    goPage(1)
    // if(res.errCode == 200){
    //     goPage(1)
    // }
}
const firstActionJoinNetwork = ()=>{
    console.log("Action Operation Screw drive 5s")
    goPage(2)
}
const secondActionJoinNetwork = ()=>{
    console.log("Action Operation Screw drive 3s")
    goPage(3)
}


useEffect(()=> {
},[itemId]);

useEffect(() => {
    console.log("OBJECTS VISIBLE  CHANGES :", objectVisible)
}, [objectVisible]);


const lastActionJoinNetwork = ()=>{

    goNextPage();
    setLoading(true)
    timerRef.current = setTimeout(()=>{
        setLoading(false)
        setObjectFound(false)
        clearTimeout(timerRef.current);

    },90000)

    //goNextPage();
}


const cancelLoading = ()=>{
    setLoading(false)
    setObjectFound(false)
    setShowModifyScreen(true)
    goBack()
}


const validateOperationRStopLedLightUp = ()=>{
    console.log("Led light up")
    navigation.navigate("AddObject")
}

const handleRestart = () => {
    navigation.navigate("ZigbeeAssistantHomeScreen")
}

const handleEquipWorks = () => {

    goNextPage();
}


const handleStopScan = ()=>{
    setLoading(false);
    navigation.navigate("ZigbeeAssistantHomeScreen")
}

const handleValidateScan = ()=>{
    goNextPage()
}

const handleCallBack = ()=>{
    navigation.dispatch(StackActions.popToTop())
    navigation.navigate("AddObject")
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
                                <HeaderScreen title =  {t(tns+":"+"ADD_EQUIP_ZIGBEE_RECEPTOR")}  goBack={()=>navigation.navigate("ZigbeeAssistantHomeScreen")}/>
                                <Body style={{marginTop:0, padding:15}}>
                                    <View>
                                        <View style={{marginTop:0, marginBottom:10}}>
                                            <Text style={styles.text}>
                                                {t(tns+":"+"LOCALIZE_RECEPTOR_BUTTON")}
                                            </Text>
                                        </View>
                                        <CardImageArrow 
                                                //onPressNextArrow = {()=>goPage(10)}
                                                withNextArrow = {false}
                                                imgStyle = {{width: 200, height: 100}}
                                                imageSource = {require('_brand/templates/screens/addObject/images/receptor-button.png')}
                                                innerWidthPercent={'85%'}
                                        />
                                    </View>

                                    <View style={[styles.validateButton, {color:textColor, marginTop:250}]}>
                                        <Button onPress={validateLocalizeButton} altStyle titleColor='white' title={t(tns+":"+"VALIDATE")} bgColor={textColor} noBorder />
                                    </View>
                                </Body>
                            </View>


                            <View key='1' style={{alignItems:'center', justifyContent:'flex-start', backgroundColor:'transparent', paddingTop:20}}>
                                <HeaderScreen title =  {t(tns+":"+"ADD_EQUIP_ZIGBEE_RECEPTOR")}  goBack={()=>{goPage(0)}}/>
                                <Body style={{marginTop:0, padding:15}}>

                                    <View>
                                        <View style={{ marginTop: 20, marginBottom: 15 }}>
                                            <Text style={styles.text}>
                                                {t(tns + ":" + "SCREWDRIVE_5S_BUTTON_PRES_IMPULSION_5SPRESS")}
                                            </Text>
                                        </View>
                                        <CardImageArrow
                                            //onPressNextArrow = {()=>goPage(10)}
                                            withNextArrow={false}
                                            imgStyle={{ width: 100, height: 70 , marginLeft:'35%'}}
                                            imageSource={require('_brand/templates/screens/addObject/images/receptor-showbutton.png')}
                                            innerWidthPercent={'85%'}
                                        />
                                        <View style={{ marginTop: 5, marginBottom: 35 }}>
                                            <Text style={[styles.text, {marginVertical:2}]}>
                                                1 - {t(tns + ":" + "FIVE_SECONDS_PRESS")}
                                            </Text>
                                            <Text style={[styles.text, {marginVertical:2}]}>
                                                2 - {t(tns + ":" + "THREE_IMPULSIONS")}
                                            </Text>
                                            <Text style={[styles.text, {marginVertical:2}]}>
                                                3 - {t(tns + ":" + "FIVE_SECONDS_PRESS")}
                                            </Text>
                                        </View>

                                        <View style={{marginTop:10, marginBottom:15}}>
                                            <Text style={styles.text}> 
                                                {t(tns+":"+"OPEN_ZIGBEE_NETWORK_EFFECT")}
                                            </Text>
                                        </View>
                                        <CardImageArrow 
                                            //onPressNextArrow = {()=>goPage(10)}
                                            withNextArrow = {false}
                                            imgStyle = {{width: 220, height: 158}}
                                            imageSource = {require('_brand/templates/screens/addObject/images/shutter-mouvement.png')}
                                            innerWidthPercent={'85%'}
                                        />

                                        <View style={[styles.validateButton, {color:textColor, marginTop:30}]}>
                                            <Button onPress={lastActionJoinNetwork} altStyle titleColor='white' title={t(tns+":"+"VALIDATE")} bgColor={textColor} noBorder />
                                        </View>
                                    </View>
                                </Body>
                            </View>


                            <View key='2' style={{ alignItems: 'center', justifyContent: 'flex-start', backgroundColor: 'transparent', paddingTop: 20 }}>
                                <HeaderScreen title={t(tns + ":" + "ADD_EQUIP_ZIGBEE_RECEPTOR")} withBack={false} goBack={cancelLoading } />
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
                                                {/* <View style={{ minWidth: 200, marginTop: 60 }}>
                                                    <Text style={[styles.text, { marginTop: 0, marginBottom: 100 }]}>
                                                        {t(tns + ":" + "RECEPTOR_EQUIP_DETECTED")}
                                                    </Text>
                                                    <MyButton onPress={handleValidateScan} title={t(tns + ":" + "VALIDATE")} />
                                                </View> */}
                                            { objectFound ?
                                                <View style={{ minWidth: 200, marginTop: 60 }}>
                                                    <Text style={[styles.text, { marginTop: 0, marginBottom: 100 }]}>
                                                        {t(tns + ":" + "RECEPTOR_EQUIP_DETECTED")}
                                                    </Text>
                                                    <MyButton onPress={handleValidateScan} title={t(tns + ":" + "VALIDATE")} />
                                                </View>
                                                :
                                                
                                                <View style={{ minWidth: 200, marginTop: 60 }}>
                                                    <Text style={[styles.text, { marginTop: 0, marginBottom: 100 }]}>
                                                        {t(tns + ":" + "RECEPTOR_NO_EQUIP_DETECTED")}
                                                    </Text>
                                                    <MyButton onPress={handleStopScan} title={t(tns + ":" + "CANCEL")} />
                                                </View>
                                            
                                            }

                                        </View>
                                    }
                                </Body>
                            </View>


                    <View key="3" style={{ alignItems: 'center', justifyContent: 'flex-start', backgroundColor: 'transparent', paddingTop: 20 }} >
                        <HeaderScreen title={t(tns + ":" + "ADD_EQUIP_PORTABLE_REMOTE")} goBack={()=>goPage(0)} />
                        <Body>
                            <Text style={[styles.text, { marginTop: 30 }]}>
                                {t(tns + ":" + "CHECK_IF_EQUIP_WORKS")}
                            </Text>
                            <View style={{ marginTop: 25,width:'90%' }}>
                                {typeof (itemId) == "number" &&
                                    <TestZigbeeObject itemId={itemId} typeNature={typeName} />
                                }
                            </View>

                            <View style={{ marginTop: 50, width: '90%' }}>
                                <MyButton onPress={handleRestart} title={t(tns + ":" + "EQUIP_NOT_WORKING")} />
                            </View>
                            <View style={{ marginTop: 10, width: '90%' }}>
                                <MyButton onPress={handleEquipWorks} title={t(tns + ":" + "EQUIP_WORKING")} />
                            </View>
                        </Body>
                    </View>


                    <View key='4' style={{ alignItems: 'center', justifyContent: 'flex-start', backgroundColor: 'transparent', paddingTop: 20 }}>
                        <HeaderScreen title={t(tns + ":" + "ADD_EQUIP_PORTABLE_REMOTE")} goBack={()=>goPage(3) } />
                        <Body style={{margin:10, backgroundColor:'transparent'}}>
                            {(showModifyScreen && typeof (itemId) == "number" ) &&
                                <View style={{ width: width - 5 }}>
                                    {/* <CommonObjectSettings newAddedItemId={itemId} goHome="MaisonScreen" noHeader={true} /> */}
                                    <ModifyNewAddedObject itemId = {itemId}  callBackSetPage={handleCallBack}/>
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
        }
  });
