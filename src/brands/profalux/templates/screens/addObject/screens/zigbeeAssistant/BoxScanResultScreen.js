import '_brand/templates/screens/addObject/locales'
import React, { useEffect, useRef ,useState} from 'react';
import { View, SafeAreaView,StyleSheet, Text, ActivityIndicator } from 'react-native';
import Button from '_brand/templates/components/ui/Button';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation, Trans } from 'react-i18next';
import { useTheme } from '_theming/themeProvider';
import { Body } from '_brand/templates/screens/addObject/components/Body';
import { HeaderScreen } from '_brand/templates/screens/addObject/components/HeaderScreen';
import { CardImageArrow } from '_brand/templates/screens/addObject/components/addBoxComponents/CardImageArrow';
import { getAllObjects, getObjectsByTypeName, getObjectsVisible } from '_helpers/selectors';
import { Api } from "_api";
import { getObjectById } from '_helpers/objects';
import { MyButton } from '_brand/templates/components/ui/MyButton';
import { RenderToogleFlatList } from '_brand/templates/components/objects/groupObject/components/RenderToogleFlatList';
import * as Durin from '_api/durin';
import {appRefresh} from '_actions/app';
import { deleteObject } from '_api/objects';
import {useGlobalModal} from '_components/ui/globalModal'
import {GlobalToast} from '_brand/templates/components/objects/common/GlobalToast'
import { IndiceText } from '_brand/templates/components/objects/common/IndiceText';

export const BoxScanResultScreen = () => {


    const navigation = useNavigation(); 
    const route = useRoute();
    const globalModal = useGlobalModal(); 
    const params = route?.params || {};
    console.log('PARAMS_BOX_RESULT_SCAN :', params);

    const { t, i18n } = useTranslation();
    const tns = "addObject";

    const { theme } = useTheme();
    const borderColor = theme?.prflxBorderColor||'orange';
    const Containerbgcolor = theme?.prflxContaintBgColor||'white';
    const bgcolor = theme?.prflxbgColor||'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor||"white";
    const textColor = theme?.prflxTextColor||'black'
    const headerBgColor = theme?.prflxHeaderBackground || '#FFFFFF'

    const leaveActions = {
        "actions": [
            {
                "name": "COMMAND",
                "mArgs": [
                    {
                        "name": "command",
                        "value": "command/io/ezsp/network"
                    },
                    {
                        "name": "arg1",
                        "value": "dev-0/self"
                    },
                    {
                        "name": "arg2",
                        "value": "leave"
                    }
                ]
            }
        ]
    }

    //################------------------------------------------------------
    // Get All ZigBee user objects
    const remoteEzsp = useSelector(state => getObjectsByTypeName(state, "RemoteEzsp")) || [];
    const shuttEzsp = useSelector(state => getObjectsByTypeName(state, "Rolling_Shutter_Ezsp")) || [];
    const shadeEzsp = useSelector(state => getObjectsByTypeName(state, "Shade_Ezsp")) || [];
    const venEzsp = useSelector(state => getObjectsByTypeName(state, "Venetian_Shutter_Ezsp")) || [];
    const ezspProbe = useSelector(state => getObjectsByTypeName(state, "EzspProbe")) || [];
    const garage_Door_Ezsp = useSelector(state => getObjectsByTypeName(state, "Garage_Door_Ezsp")) || [];
    const gate_Toggle_Ezsp = useSelector(state => getObjectsByTypeName(state, "Gate_Toggle_Ezsp")) || [];
    const garage_Door_Toggle_Ezsp = useSelector(state => getObjectsByTypeName(state, "Garage_Door_Toggle_Ezsp")) || [];
    const gate_Ezsp = useSelector(state => getObjectsByTypeName(state, "Gate_Ezsp")) || [];
    const switchEzsp = useSelector(state => getObjectsByTypeName(state, "SwitchEzsp")) || [];
    const lightEzsp = useSelector(state => getObjectsByTypeName(state, "LightEzsp")) || [];

    const userAllZigbeeObjects = shuttEzsp.concat(shadeEzsp, venEzsp, ezspProbe, garage_Door_Ezsp, gate_Ezsp, gate_Toggle_Ezsp, garage_Door_Toggle_Ezsp, switchEzsp, lightEzsp) || []
    
    const { myBoxDongleId, gatewayObjectId, gatewayGwId } = params;
    
    const [isLeaving, setIsLeaving] = useState(false);
    const timerRef = useRef(null);

    useEffect(()=> {
    
    },[isLeaving]);
    
    const getBoxZigbeeObjects = (objects, gwId) => {
        const filteredObjects = objects.filter(item => {
            const data = getObjectById(item);
            return data?.gw == gwId;
        });
        return filteredObjects;
    }
    const searchResults = getBoxZigbeeObjects(userAllZigbeeObjects, gatewayGwId);
    console.log('SEARCH_RESULTS_search :', searchResults);
    console.log('SEARCH_RESULTS_userAll : ', userAllZigbeeObjects);
    console.log('SEARCH_RESULTS_gwId : ', gatewayGwId);

    const validateMyEquipments = async()=>{
        const actions = {
            "actions": [
                {"name": "COMMAND", "mArgs": [
                        { "name": "command","value": "command/io/ezsp/discover"},
                        {"name": "arg1","value": "dev-0/self"},
                        {"name": "arg2","value": "complete"}
                    ]
                }
            ]
        }
        const resAction = await Durin.update("object", gatewayObjectId, actions)
        console.log("RESULT ACTION :", resAction)
        navigation.navigate("AddObject")
        navigation.navigate("MaisonScreen")
    }

    const onItemClick = (item) => {
        console.log('ITEM_CLICKED :', item);
    }

    const handleWrongNetworkConfig = async () => {
        onOpenSelect()
    }

    //???????????????????????????????????????????????????????????
    //const buttonsRef = useRef([])
        const buttons = [
            {
                id:"return",
                text:`${t(tns + ":" + "BACK")}`,
                action:()=>onModalCancel(),
                textColor:"#007AFF"
            },
            {
                id:"validate",
                text:`${t(tns + ":" + "REINITIALIZE")}`,
                action:()=>onModalValidate(),
                textColor:"red"
            },
        ]
    
        const onModalCancel = () => {
        console.log('CANCEL :');
        globalModal.close();
        }

        const onModalValidate = async() => {
            // Restore navigation stack and navigate to the main screen
            globalModal.close();
            setIsLeaving(true)
            //Remove all zigbee objects associated with the current gateway
            const zigbeeObjectsList = userAllZigbeeObjects.concat(remoteEzsp)
            const objectsToDelete = zigbeeObjectsList.filter(item => {
                const data = getObjectById(item);
                return data?.gw == gatewayGwId;
            });

            const leaveRequest = await Durin.update("object", gatewayObjectId, leaveActions)
            console.log("CHECK LEAVING REQUEST :", leaveRequest)

            timerRef.current = setTimeout(async() => {
                navigation.navigate("AddObject")
                navigation.navigate("MaisonScreen")
                setIsLeaving(false)
                clearTimeout(timerRef.current);
                await objectsToDelete.reduce(async (accumulator, item) => {
                    await accumulator;
                    // delete next item
                    const deleteItem = await deleteObject(item).catch((err) => { console.log(err) });
                    console.log("DELETE REQUEST :", deleteItem)
                    
                }, Promise.resolve());
                dispatch(appRefresh());

            }, 30000)//1min
        }
    
        const onOpenSelect = () => {  
            const content = (
            <View style={{width:275, backgroundColor:'transparent',alignSelf:'center',justifyContent:'center',alignItems:'center', borderRadius:14}}>
                <GlobalToast 
                    toastTitle={t(tns + ":" + "WARNING")}
                    toastBody={t(tns + ":" + "ACTION_REINITIALIZE_BOX_EQUIPMENTS")}
                    buttons={buttons}
                />
            </View>
                )
            globalModal.setContent(content,{type:'centered'});    
            globalModal.toggle();
        }
    //???????????????????????????????????????????????????????????

    const subText = (
        <Text>box</Text>
    )

    const RenderObjectsFound = ({objects}) => {
        return (
            <View style={{justifyContent:'center', alignItems:'center', backgroundColor:"transparent"}}>
                <View style={{ 
                        flex:1,width:"100%",borderRadius:12, justifyContent:'center',padding:5,
                        //borderWidth:1
                        //backgroundColor:Containerbgcolor, 
                        //borderColor:borderColor,
                    }}>
                        <Text style={{textAlign:'center',flexDirection:'row', fontSize: 16, fontWeight:'400', color: textColor, marginVertical: 20,}}>
                            {t(tns + ":" + "EQUIPMENTS_FOUND")} :
                            {/* Votre CalypsHOME<View><Text style={{color:textColor,position:'absolute',top:-10}}>box</Text></View> */}
                        </Text>
                        <RenderToogleFlatList
                            isPressable= {false}
                            numColumns = {4}
                            iconSize={30}
                            isRedirectOnSelect = {false}
                            forcePadding = {0}
                            selectable = {objects}
                            callBack ={onItemClick}
                            selection = {objects}// used as preselected item : use [] to renove orange contour
                            bgColor = "white"
                            scanBgColor = "white"
                            //bgColor = "#3E495E"
                            iconColor = "#FFFFFF"
                            />

                        <Text style={{textAlign:'center', fontSize: 16, fontWeight:'400', color: textColor, marginTop: 20, marginBottom: 10 }}>
                            {t(tns + ":" + "ARE_THERE_YOUR_EQUIPMENTS")}
                        </Text>
                        <Text style={{textAlign:'center', fontSize: 16, fontWeight:'400', color: textColor, marginVertical: 0 }}>
                            {t(tns + ":" + "BATTERY_POWERED_EQUIPMENTS_TAKE_LONG_TO_APPEAR")}
                        </Text>
                            
                </View>
                <View style={[styles.validateButton, { color: textColor, marginTop: 10, width: '85%' }]}>
                        <Button onPress={validateMyEquipments} altStyle titleColor='white' title={t(tns + ":" + "END")} bgColor={textColor} noBorder />
                </View>

                <View style={[styles.validateButton, { color: textColor, marginTop: 0, marginBottom:20, width: '85%' }]}>
                    <Button onPress={handleWrongNetworkConfig} altStyle titleColor='white' title={t(tns + ":" + "RESTART")} bgColor={textColor} noBorder />
                </View>

            </View>
        )
    }

    const ReanderNoObjectsFound = () => {
        return(
            <View style={{alignItems:'center', justifyContent:'center', backgroundColor:'transparent', marginTop:20}}>
                <Text style={{textAlign:'center', fontSize: 16, fontWeight:'400', color: textColor, marginBottom: 150 }}>
                    {t(tns + ":" + "SEARCH_ENDED")}
                </Text>
                <Text style={{textAlign:'center', fontSize: 16, fontWeight:'600', color: textColor, marginBottom: 50 }}>
                    {t(tns + ":" + "FAILURE")}
                </Text>
                <Text style={{textAlign:'center', fontSize: 16, fontWeight:'400', color: textColor, marginBottom: 100 }}>
                    {t(tns + ":" + "NO_EQUIPMENT_DETECTED")}
                </Text>
                <View style={[styles.validateButton, { color: textColor, marginBottom:20, width: '85%' }]}>
                    <Button onPress={handleRestart} altStyle titleColor='white' title={t(tns + ":" + "CLOSE_ASSISTANT")} bgColor={textColor} noBorder />
                </View>
            </View>
        )
    }
        

    const handleRestart = () => {
        clearTimeout(timerRef.current);
        navigation.navigate("AddObject")
        navigation.navigate("MaisonScreen")
        //navigation.navigate("OpenNetworkScreen")
    }

    let titleText = searchResults?.length == 0 ? t(tns + ":" + "EQUIP_SEARCH") : t(tns + ":" + "CALYPSHOME_NETWORK");
    return (
        <SafeAreaView>
            <View style={{ alignItems: 'center', justifyContent: 'flex-start', backgroundColor: bgcolor, paddingTop: 20 }}>
                <HeaderScreen title={titleText} goBack={handleRestart} />
                <Body style={{padding:10, backgroundColor:'transparent',}}>
                    <View style={{width:'100%',opacity:isLeaving ? 0.2 : 1}}>
                    {searchResults.length != 0 ?
                        <View style={{width:'100%'}}>
                            <RenderObjectsFound objects = {searchResults}/>
                        </View>
                        :
                        <View style={{}}>
                            <ReanderNoObjectsFound/>
                        </View> 
                    }
                    </View>

                    {isLeaving &&
                            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 150, justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ marginVertical: 50 }}>
                                    <ActivityIndicator size="large" color='#3E495E' style={{ transform: [{ scaleX: 4 }, { scaleY: 4 }] }} />
                                    <Text style={{ marginTop: 80, color: textColor, fontSize: 16, fontWeight: "500", textAlign:'center'}}>{t(tns + ":" + "BOX_LEAVING_NETWORK")}</Text>
                                </View>
                            </View>
                        }

                    <View style={{height:80,width:'100%'}}/>

                </Body>
            </View>
        </SafeAreaView>

    )
};

const styles = StyleSheet.create({
    validateButton: {
        color:"#FFFFFF",
        height: 50,
        marginTop:0,
        marginBottom:5,
    },
})