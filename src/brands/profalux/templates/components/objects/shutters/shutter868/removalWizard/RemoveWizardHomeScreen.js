import '_brand/templates/screens/addObject/locales'
import React,{ useState,useRef, useEffect } from 'react';
import { View,Text,StyleSheet,SafeAreaView} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import PagerView from 'react-native-pager-view';
import { useTheme } from '_theming/themeProvider';
import { ChoixDongleRadio868 } from  '_brand/templates/screens/addObject/components/ChoixDongleRadio868';
import { InstructionBranchDongle } from  '_brand/templates/screens/addObject/components/InstructionBranchDongle';
import { UserObjectTypeChoice } from  '_brand/templates/screens/addObject/components/UserObjectTypeChoice';
import Button from '_brand/templates/components/ui/Button';
import { Body } from  '_brand/templates/screens/addObject/components/Body';
import { LoadingAnimation } from  '_brand/templates/screens/addObject/components/LoadingAnimation';
import { AddObjectCountDownTasks } from  '_brand/templates/screens/addObject/components/AddObjectCountDownTasks';
import { TestObjectBeforeAdding } from  '_brand/templates/screens/addObject/components/TestObjectBeforeAdding';
import { HeaderScreen } from  '_brand/templates/screens/addObject/components/HeaderScreen';
import { CardImageArrow } from '_brand/templates/screens/addObject/components/addBoxComponents/CardImageArrow';

import Toast from 'react-native-root-toast';
import {getObjectsByTypeName} from '_helpers/selectors';
import {getObjectById} from '_helpers/objects';
import {Api} from "_api";
import * as Actions from '_actions/objects';
import { removeItemFromUserFav } from '_brand/utils/removeItemFromUserFav';
import { deleteObject } from '_api/objects';



export const RemoveWizardHomeScreen = () => {


    const pagerRef = useRef(null);
    const currentPageRef = useRef(0)

    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {};
    const {itemId} = navigationParams;   
    console.log("CHECK_RECEIVE_PARAMS",itemId)

    const { t, i18n } = useTranslation();
    const tns = "common";
    const dispatch = useDispatch();


    const [allStates, setAllStates] = useState({currentPage:0});
    const [showContent, setShowContent] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showTestObject, setShowTestObject] = useState(false);
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(0);

    const {theme} = useTheme();  
    const bgcolor = theme?.prflxbgColor||'white';
    const textColor = theme?.prflxTextColor||'black'

        //-------- Scan for dongle and object type name-------
    const whichDongle = "Profalux" // "Profalux"
    const whichObjTypeName = "Rolling_Shutter_Profalux" // LightEzsp

    const dongleList = useSelector(state =>getObjectsByTypeName(state,whichDongle));//Zigbee_EZSP, Profalux
    const loadShutter868 =  useSelector(state =>getObjectsByTypeName(state,whichObjTypeName)); 

    // ---------------------

    const storeShutter868Ref = useRef(JSON.stringify(loadShutter868));
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
        //console.log("currentPage changed",allStates.currentPage)
        const myDongle = JSON.parse(updateStateDongleRef.current);
        if(allStates.currentPage == 0){
            handleValidateScan()
       }

       if(allStates.currentPage == 1){
        setRefresh(prevKey => prevKey + 1)
        pagerRef.current?.setPage(1);
       }

       updateStateDongleRef.current = JSON.stringify(dongleList);


    },[allStates.currentPage, dongleList]);




    const handleValidateScan = () => {
        const myDongle = JSON.parse(updateStateDongleRef.current);
        if(myDongle.length !=0){
            const dongleData = getObjectById(myDongle[myDongle?.length-1])
            const dongleConnected = dongleData?.connected
            console.log("CHECK_IF_DONGLE_PRESENT :", dongleConnected)

            if(dongleConnected){
                // If dongle is present and connected : keep on 
                setLoading(false);
                setShowContent(true)
            }else{
                // If dongle is registerd but disconnected : bloc assistant
                setLoading(true)
                const timeOut = setTimeout(()=>{
                    setLoading(false)
                    pagerRef.current?.setPage(1);
                }, 15000)
            }


        }else{
            setLoading(true)
            const timeOut = setTimeout(() => {
                const myDongle = JSON.parse(updateStateDongleRef.current);
                if(myDongle.length !=0){
                    setLoading(false);
                    setShowContent(true)
                }else{
                    setLoading(false);
                    setShowContent(false)
                }
            }, 60000);
        }  
}

const handleLoadingGoback = ()=>{
    //setLoading(false);
    goBack();
} 


    const handleDelete = async () => {
        // alert("Really wanna delete?")
        console.log("Deleted itemId :", itemId)
        navigation.goBack()
        const res = await deleteObject(itemId).catch((err) => { console.log(err) });
        if (res.errCode == 200) {
            await removeItemFromUserFav(itemId)
            Toast.show(
                `${t(tns + ":" + "TOAST_DELETE")}`,
                {
                    backgroundColor: 'black',
                    textColor: 'white',
                    textStyle: { fontSize: 16, fontWeight: '600' },
                    containerStyle: { width: '80%', height: 100, justifyContent: 'center', alignItems: 'center', borderRadius: 10, borderColor: borderColor, borderWidth: 2 },
                    //position: Toast.positions.CENTER,
                    position: -350,
                    duration: 2000,
                    //onHide:()=>navigation.goBack()
                }
            );
            navigation.goBack()
            const action = Actions.objectDelete(itemId);
            dispatch(action)
        }
        //console.log('item deleted ', itemId);
        //actionSheetRef.current?.dismiss();
    }

const new868Id = useRef(null);


const onTimerComplete = ()=>{
    setShowTestObject(true);
    setIsPlaying(false)
    goNextPage()
}

const handleIconPress = (iconId) =>{
    console.log("CHECK_ICON_ID_PRESSED:", iconId)
}


const handleRestart = ()=>{
    //console.log("Research again !! :")
    navigation.goBack()
}

const handleEquipNotWorking = ()=>{
    goNextPage()
}


///////// RENDER OTHER METHOD
const RenderLoading = ()=>{
    return(
        <View>
            <LoadingAnimation 
                 topText = {`${t(tns + ":" + "DONGLE_SEARCH")}`}
            />
        </View>
    )
}

const goBackProductDetail = ()=>{
    navigation.goBack()
}
const validateRemoteControlEquip = ()=>{
    setIsPlaying(true)
    goNextPage()
}

const RenderNoDongle = ()=>{
    return(
        <Body>
            <View  style={{alignItems:'center', justifyContent:'flex-start', backgroundColor:'transparent', paddingTop:20}}>
                <Body>
                    <View style={{justifyContent:'center', alignItems:'center', marginBottom:25,marginTop:0, backgroundColor:'transparent'}}>
                        <Text style={styles.text}>
                            {t(tns + ":" + "NO_DONGLE_FOUND")}
                        </Text>
                    </View>
                    <View style={{justifyContent:'center', alignItems:'center', marginBottom:25,marginTop:0, backgroundColor:'transparent'}}>
                        <Text style={styles.text}>
                            {t(tns + ":" + "INSTRUCTION_PLUG_DONGLE")}
                        </Text>
                    </View>
                    <InstructionBranchDongle />
                    <View style={[styles.validateButton, {color:textColor}]}>
                        <Button onPress={goBackProductDetail} altStyle titleColor='white' title={t(tns + ":" + "END")} bgColor={textColor} noBorder />
                    </View>
                </Body>
            </View>
        </Body>
    )
}


const RenderBody = ()=>{
    return (
        <Body style={{marginTop:20}}>
            <View style={{marginBottom:25}}>
                    <Text style={styles.text}> {t(tns + ":" + "CHECK_EQUIP_WORK_BY_REMOTE")}</Text>
            </View>
            <View style={{marginBottom:25}}>
                <Text style={styles.text}>  {'\u2022'} {t(tns + ":" + "SET_EQUIP_MIDLEVEL")}</Text>
            </View>
            <View style={{marginBottom:25}}>
                <Text style={styles.text}>  {'\u2022'} {t(tns + ":" + "CHECK_REMOTE_MOVE_ONLY_EQUIP_TO_DELETE")}</Text>
            </View>
            <View style={{marginBottom:25}}>
                    <Text style={styles.text}> {t(tns + ":" + "IF_REMOTE_MOVE_MANY_EQUIPS_CHANGE_REMOTE")}</Text>
            </View>
            <View style={[styles.validateButton, {color:textColor}]}>
                <Button onPress={validateRemoteControlEquip} altStyle titleColor='white' title={t(tns + ":" + "VALIDATE")} bgColor={textColor} noBorder />
            </View>
    </Body>
    )
}
/////////////////////
    

      return (
        <SafeAreaView style={{height:'100%', backgroundColor:'transparent'}}>

            <PagerView 
                style={[{flex:1, backgroundColor:bgcolor}]} 
                ref={pagerRef}
                initialPage={0}
                scrollEnabled={false}
                onPageSelected={onPageSelected}
                        >

                            <View key="0" style={{alignItems:'center', justifyContent:'flex-start', backgroundColor:'transparent', paddingTop:20}} >
                                <HeaderScreen title ={t(tns + ":" + "EQUIP_DELETION")} goBack={handleLoadingGoback}/>

                                {
                                    loading ==true ? 
                                        <RenderLoading/> 
                                        :
                                            showContent ? 
                                                    <RenderBody/>
                                                    
                                                    :   <RenderNoDongle/>
                                                                
                                }
                            </View>

                            <View key='1' style={{alignItems:'center', justifyContent:'flex-start', backgroundColor:'transparent', paddingTop:10}}>
                                <HeaderScreen title = {t(tns + ":" + "EQUIP_DELETION")}  goBack={()=> {setIsPlaying(false) ;goBack()}}/>
                                        <View style={{marginBottom:40}}>
                                            <Body>
                                            <View>
                                                <AddObjectCountDownTasks isTimerPlaying = {isPlaying} duration = {60} onComplete={onTimerComplete} refresh = {refresh}/>
                                            </View>
                                            
                                            <View style={{justifyContent:'center', alignItems:'flex-start', marginTop:25, width:332, backgroundColor:'transparent', flex:1}}>
                                                <Text style={[styles.text, {marginTop:10, textAlign:'auto'}]}>
                                                {t(tns + ":" + "WITH_REMOTE_60S_MANIP")} :
                                                </Text>
                                                <Text style={[styles.textNoMargin, {marginTop:15, textAlign:'auto'}]}>
                                                    {'\u2022'}{t(tns + ":" + "PRESS_DOWN_LEAVE_EQUIP_STOP")} 
                                                </Text>
                                                <Text style={[styles.textNoMargin, {marginTop:4, textAlign:'auto'}]}>
                                                    {'\u2022'} {t(tns + ":" + "PRESS_UP_LEAVE_4_BLADES")}  
                                                </Text>
                                                <Text style={[styles.textNoMargin, {marginTop:4, textAlign:'auto'}]}>
                                                    {'\u2022'} {t(tns + ":" + "PRESS_STOP")} 
                                                </Text>
                                                <Text style={[styles.textNoMargin, {marginTop:4, textAlign:'auto'}]}>
                                                    {'\u2022'} {t(tns + ":" + "PRESS_DOWN_LEAVE_EQUIP_STOP")} 
                                                </Text>
                                            </View>
                                            <View style={[styles.validateButton, {color:textColor, marginTop:50}]}>
                                                <Button onPress={onTimerComplete} altStyle titleColor='white' title={t(tns + ":" + "VALIDATE")} bgColor={textColor} noBorder />
                                            </View>
                                            </Body>
                                        </View>
                            </View>

                            <View key='2' style={{alignItems:'center', justifyContent:'flex-start', backgroundColor:'transparent', paddingTop:0}}>
                                    <HeaderScreen title ={t(tns + ":" + "ADD_EQUIP")} goBack={()=>{goBack() ; setRefresh(prevKey => prevKey + 1) }}/>
                                    <Body>
                                        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                                            <View style={{justifyContent:'center', alignItems:'center', marginTop:25, marginBottom:10, backgroundColor:'transparent'}}>
                                                <Text style={[styles.text, {textAlign:'center'}]}>
                                                {t(tns + ":" + "CHECK_EQUIP_NOT_WORKING")}
                                                </Text>
                                            </View>

                                            <View>
                                                { itemId != null &&
                                                    <TestObjectBeforeAdding itemId = {itemId} handleIconPress ={handleIconPress} />
                                                }
                                            </View>

                                            <View style={[styles.validateButton, {color:textColor, marginTop:100}]}>
                                                <Button onPress={handleRestart} altStyle titleColor='white' title={t(tns + ":" + "RESTART")} bgColor={textColor} noBorder />
                                            </View>
                                            <View style={[styles.validateButton, {color:textColor, marginTop:10}]}>
                                                <Button onPress={handleEquipNotWorking} altStyle titleColor='white' title= {t(tns + ":" + "EQUIP_NOT_WORKING")}  bgColor={textColor} noBorder />
                                            </View>
                                        </View>
                                    </Body>
                            </View>

                            <View key='3' style={{alignItems:'center', justifyContent:'flex-start', backgroundColor:'transparent', paddingTop:20}}>
                                <HeaderScreen title={t(tns + ":" + "EQUIP_DELETION")} goBack={goBack}/>
                                <Body>
                                    <View style={{justifyContent:'center', alignItems:'center', backgroundColor:'transparent', marginTop:30, marginBottom:200}}>
                                        <Text style={styles.text}>
                                            {t(tns + ":" + "RADIO_INTEGRATED_EQUIP_868_DELETED")}  
                                        </Text>
                                    </View>

                                    <View style={[styles.validateButton, {color:textColor}]}>
                                        <Button onPress={handleDelete} altStyle titleColor='white' title={t(tns + ":" + "END")} bgColor={textColor} noBorder />
                                    </View>
                                </Body>
                            </View>
            </PagerView>
        </SafeAreaView>
   
        )
};


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'red',
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerStyle:{
        justifyContent:'center',
        borderBottomColor:'orange',
        borderBottomWidth:2,
        height:'8%',
        backgroundColor:"#FFFFFF",
        marginBottom:0
      },
    pager: {
      flex: 1,
    //   alignSelf: "stretch",
    //   width: "100%",
    //   height:"100%",
    },
    bodyWrapper:{
        margin:20,
        //flexDirection:'column',
        // justifyContent:'center',
        // alignItems:'center',
        padding:21,
        borderWidth:2, 
        borderRadius:12,
    },
      bodyContent:{
    flex:1,
    margin:11,
    justifyContent:'space-evenly',
    padding:11,
    borderColor:'orange',
    borderWidth:2,
    borderRadius:15,
    backgroundColor:'white'
  },
    bodyStyle:{
        backgroundColor:'transparent',
        flex:1,flexDirection:'row',
        alignItems:'center', 
        justifyContent:'flex-start',
    },
    scrollWrapper:{
        marginTop:5, 
        paddingHorizontal:0,
        flex:1,
        justifyContent:'center',
        alignItems:'stretch'
        },
        text:{
            fontSize:16,
            fontWeight:'400',
            alignItems:'center',
            justifyContent:'center',
            textAlign:'center',
            flexWrap:'wrap',
            lineHeight:20,
            marginVertical:10
        },
        textNoMargin:{
            fontSize:16,
            fontWeight:'400',
            alignItems:'center',
            justifyContent:'center',
            textAlign:'center',
            flexWrap:'wrap',
            lineHeight:20,
        },
        validateButton:{
            minWidth:200,
            height:50,
            marginTop:50,
        }
  });
