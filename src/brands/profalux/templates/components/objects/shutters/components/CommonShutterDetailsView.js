import '_brand/templates/components/objects/common/locales'
import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Modal, Alert, Pressable} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { useTranslation } from 'react-i18next';
import { useTheme } from '_theming/themeProvider';
import { useSelector, useDispatch } from 'react-redux';

import { useObject } from '_hooks/object';

import { iconsJs } from '_brand/utils/iconsJs';
import { MultiPurposeWidgetLine } from "_brand/templates/components/objects/common/MultiPurposeWidgetLine";
import { RoutineWidgetLine } from "_brand/templates/components/objects/common/RoutineWidgetLine";
import { BottomDeleteSheet } from '_brand/templates/components/objects/common/BottomDeleteSheet';
import { deleteObject } from '_api/objects';
import * as Actions from '_actions/objects';
import Toast from 'react-native-root-toast';
//import Toast from 'react-native-toast-message';

import { removeItemFromUserFav } from '_brand/utils/removeItemFromUserFav';
import {useScenario} from '_brand/templates/screens/routines/hook/useScenario'
import { getObjectById } from '_helpers/objects';
import { myToast } from '_brand/templates/components/ui/myToast';
import {appRefresh,closeWS} from '_actions/app';
import { ModalSetFavPosition } from './ModalSetFavPosition';
import { RoutineWidgetIcon } from '_brand/templates/components/objects/common/RoutineWidgetIcon';
import { RenderIconByState } from "_brand/templates/components/objects/common/RenderIconByState";
import { CommonBottomSheetDeleteContent } from '_brand/templates/components/objects/common/CommonBottomSheetDeleteContent';
import {useGlobalModal} from '_components/ui/globalModal'



const CommonShutterDetailsView = (props) => {
    const { itemId, setKebab, traits } = props;

    const globalModal = useGlobalModal(); 
    const uScenario = useScenario();
    const { updateActions, isRoutine } = uScenario;
    console.log("ISROUTINE DETAIL", isRoutine)

    const gloIsConnected = useSelector(state => state?.network?.isConnected);
    const gloServerIsDown = useSelector(state => state?.network?.serverIsDown);
    const netInfoIsConnected = (gloIsConnected == true && gloServerIsDown == false);
    const dispatch = useDispatch();
    // Shutter Object all infos
    const uObject = useObject(itemId);
    const typeName = uObject?.objectDatas?.typeName;
    const connected = uObject?.objectDatas?.connected;
    const objectName = uObject?.name
    console.log("UOBJECT TO CHECK :", uObject);
    const traitsCheck = uObject?.objectDatas?.traits;
    const shutterLevel = uObject?.statuses?.level
    let levelState = shutterLevel ? Number(shutterLevel) : shutterLevel
    const angle = uObject?.statuses?.angle
    const status = uObject?.statuses?.status;
    const typeNature = uObject?.statuses?.__user_typeNature;

    const lockedByWindProtection = uObject?.statuses?.__lock_message
    const modeIcon ={
        "wind":<iconsJs.windSockIcon.name color={"orange"||textColor}/>,
    }


    let picto868;
    if (typeNature == "store") {
        picto868 = [iconsJs.store868Icon]
    } else if (typeNature == "bso") {
        picto868 = [iconsJs.bso868Icon]
    } else { picto868 = [iconsJs.vr868Icon] }


    console.log(" GET STATUS :", status);

    const [currentActive, setCurrentActive] = useState();
    const [levelMessage, setLevelMessage] = useState("");
    const [stateIcon, setStateIcon] = useState([])
    const [isBSO, setIsBSO] = useState(traits?.includes("Rotation"));
    const [isStore, setIsStrore] = useState(traits?.includes("Rotation"));

    const [activeAction, setActiveAction] = useState("");
    const [isTiltActive, setIsTiltActive] = useState("");
    const [modalVisible, setModalVisible] = useState(false);


    useEffect(()=> {
    },[lockedByWindProtection]);
    

    useEffect(()=> {
    
    },[modalVisible]);

    useEffect(() => {

    }, [isTiltActive])
    useEffect(() => {

    }, [activeAction])


    const { t, i18n } = useTranslation();
    const tns = "common";
    const { theme } = useTheme();

    const navigation = useNavigation();




    function range(start, end) {
        if (start === end) return [start];
        return [start, ...range(start + 1, end)];
    }
    const openRange = range(90, 100);
    const levelRange75 = range(75, 89);
    const levelRange50 = range(50, 74);
    const levelRange25 = range(25, 49);
    const closeRange = range(0, 24);

    useEffect(() => {
        const tempStatus = shutterLevel
        let statusLevel =  tempStatus != undefined ?  Number(tempStatus) : tempStatus;
        console.log('SHOW_STATUS :', statusLevel);
        if (closeRange?.includes(statusLevel)) {
            isBSO ? setStateIcon([iconsJs.bsoCloseIcon]) : setStateIcon([iconsJs.vrCloseIcon]);
        }
        if (openRange?.includes(statusLevel)) {
            isBSO ? setStateIcon([iconsJs.bsoOpenIcon]) : setStateIcon([iconsJs.vrOpenIcon]);
        }
        if (levelRange25?.includes(statusLevel)) {
            isBSO ? setStateIcon([iconsJs.bsoLevel25Icon]) : setStateIcon([iconsJs.vrLevel25Icon]);
        }
        if (levelRange50?.includes(statusLevel)) {
            isBSO ? setStateIcon([iconsJs.bsoLevel50Icon]) : setStateIcon([iconsJs.vrLevel50Icon]);
        }
        if (levelRange75?.includes(statusLevel)) {
            isBSO ? setStateIcon([iconsJs.bsoLevel75Icon]) : setStateIcon([iconsJs.vrLevel75Icon]);
        }
        if(statusLevel == undefined){
            isBSO ? setStateIcon([iconsJs.bsoLevel50Icon]) : setStateIcon([iconsJs.vrLevel50Icon]);
        }
    }, [shutterLevel]);

    useEffect(() => {

    }, [currentActive])

    useEffect(() => {

    }, [status])

    useEffect(() => {
        console.log("TRAITSCHECK :", traitsCheck)
    }, [traitsCheck])
    useEffect(() => {
        console.log("TRAITS :", traits)
    }, [traits])


    const handleOnPress = (iconId) => {
        console.log("MY ICON ID :", iconId)
        if (iconId === 'FAV_CALL_1/FAV_CALL_1/' + `${itemId}`) {
            const action = 'FAV_CALL_1/FAV_CALL_1/' + `${itemId}`;
            setCurrentActive(iconId);
            //uObject.execute("FAV_CALL_1");
            if (isRoutine) {
                updateActions(action)
                setActiveAction(iconId)
            } else {

                uObject?.execute("FAV_CALL_1");
            }
        }
        if (iconId === "STOP/STOP/" + `${itemId}`) {
            setCurrentActive(iconId);
            uObject.execute("STOP");
        }
        if (iconId === "LEVEL/17/" + `${itemId}`) {
            const action = "LEVEL/17/" + `${itemId}`;
            setCurrentActive(iconId);
            if (isRoutine) {
                updateActions(action)
                setActiveAction(iconId)
            } else {
                uObject.execute("LEVEL", { mArgs: [{ name: 'level', value: 17 }] });
            }
        }

        // Level opening
        if (iconId === 'OPEN/OPEN/' + `${itemId}`) {
            const action = "OPEN/OPEN/" + `${itemId}`
            setCurrentActive(iconId);
            if (isRoutine) {
            } else {
                uObject.execute("OPEN");
            }
        }
        if (iconId === 'LEVEL/25/' + `${itemId}`) {
            const action = "LEVEL/25/" + `${itemId}`
            setCurrentActive(iconId);
            if (isRoutine) {
            } else {
                uObject.execute("LEVEL", { mArgs: [{ name: 'level', value:25 }] });
            }
        }
        if (iconId === 'LEVEL/50/' + `${itemId}`) {
            const action = "LEVEL/50/" + `${itemId}`
            setCurrentActive(iconId);
            if (isRoutine) {
            } else {
                uObject.execute("LEVEL", { mArgs: [{ name: 'level', value: 50 }] });
            }
        }
        if (iconId === 'LEVEL/75/' + `${itemId}`) {
            const action = "LEVEL/75/" + `${itemId}`
            setCurrentActive(iconId);
            if (isRoutine) {
            } else {
                uObject.execute("LEVEL", { mArgs: [{ name: 'level', value: 75 }] });
            }
        }

        if (iconId === 'CLOSE/CLOSE/' + `${itemId}`) {
            const action = "CLOSE/CLOSE/" + `${itemId}`
            setCurrentActive(iconId);
            if (isRoutine) {
            } else {
                uObject.execute("CLOSE");
            }
        }

        //Angle mouvements
        if (iconId === "TILT/0/" + `${itemId}`) {
            const action = "TILT/0/" + `${itemId}`
            setCurrentActive(iconId);
            if (isRoutine) {
            } else {
                uObject.execute("TILT", { mArgs: [{ name: 'angle', value: 0 }] });
            }
        }
        if (iconId === "TILT/22/" + `${itemId}`) {
            const action = "TILT/22/" + `${itemId}`
            setCurrentActive(iconId);
            if (isRoutine) {
            } else {
                uObject.execute("TILT", { mArgs: [{ name: 'angle', value: 22 }] });
            }
        }
        if (iconId === "TILT/45/" + `${itemId}`) {
            const action = "TILT/45/" + `${itemId}`
            setCurrentActive(iconId);
            if (isRoutine) {
            } else {
                uObject.execute("TILT", { mArgs: [{ name: 'angle', value: 45 }] });
            }
        }
        if (iconId === "TILT/67/" + `${itemId}`) {
            const action = "TILT/67/" + `${itemId}`
            setCurrentActive(iconId);
            if (isRoutine) {
            } else {
                uObject.execute("TILT", { mArgs: [{ name: 'angle', value: 67 }] });
            }
        }
        if (iconId === "TILT/90/" + `${itemId}`) {
            const action = "TILT/90/" + `${itemId}`
            setCurrentActive(iconId);
            if (isRoutine) {
            } else {
                uObject.execute("TILT", { mArgs: [{ name: 'angle', value: 90 }] });
            }
        }

    }

    const handleOnLongPress = (iconId) => {
        console.log('SET_YOUR_FAVORITE_HERE :', iconId);
        const shutterName = uObject?.name
        console.log('TYPE_NAME_FAV :', shutterName);
        if(typeName == "Rolling_Shutter_Profalux"){
            setModalVisible(true)
        }else{

            uObject.execute("FAV_SET_1");
            setTimeout(() => {
                setCurrentActive();
                Toast.show(
                    `${t(tns + ":" + "FAVORITE_POSITION_SET")}`,
                    {
                        backgroundColor: 'black',
                        textColor: 'white',
                        textStyle: { fontSize: 16, fontWeight: '600' },
                        containerStyle: { width: '80%', height: 100, justifyContent: 'center', alignItems: 'center', borderRadius: 10, borderColor: borderColor, borderWidth: 2 },
                        //position: Toast.positions.CENTER,
                        position: -350,
                        duration: 3000,
                        onHide: () => { }
                    }
                );
            }, 1000);

        }

    }


    //////////-------- Dealing with kebab menu
    const options = [
        {
            id: "modify",
            title: `${t(tns + ":" + "KEBAB_MODIFY")}`,
            iconJSName: iconsJs.modifyIcon.name,
            action: () => kebabUpdateAction()
        },
        {
            id: 'delete',
            title: `${t(tns + ":" + "KEBAB_DELETE")}`,
            iconJSName: iconsJs.deleteIcon.name,
            action: () => kebabDeleteAction()
        },
    ]
    //////////////////////////
    const actionSheetRef = useRef(null);
    const kebabDeleteAction = () => {
       //actionSheetRef.current?.present()
        onOpenSelect()
        // if(typeName == "Rolling_Shutter_Profalux"){
        //     console.log('DELETE_CASE_PROFALUX_868 :', typeName);
        //     // Navigate to 868 removable assistant
        //     //navigation.goBack()
        //     navigation.navigate("RemoveWizardStack", {screen:"RemoveWizardHomeScreen", params:{itemId}})

        // }else{
        //     actionSheetRef.current?.present()
        // }
    }

    ////////////////////////
    // Show the setting icon on header of level 2 widget 
    useEffect(() => {

        if (setKebab) {
            setKebab(options)
        }
    }, []);

    const kebabUpdateAction = () => {
        // variable "itemPicked" below, is what the GroupModifyScreen needs to be transfered via route params
        const typeName = uObject?.objectDatas?.typeName;
        (typeName === 'composite') ?
            navigation.navigate('GroupModifyScreen', { itemPicked: itemId })
            :
            navigation.navigate('ProductSettings', { 'typeName': typeName, itemId: itemId });
    }

    const onCancelPressed = () => {
        console.log('CANCEL_DELETE :');
        globalModal.close();
    }

    const onOpenSelect = () => {  
        const content = (
        <View style={{width:'100%', height: 200}}>
            <CommonBottomSheetDeleteContent 
                nameToDelete={`${t(tns+":"+"THIS_EQUIPMENT")}`} 
                warningText={`${t(tns+":"+"WARNING_DELETE")}`}
                textColor={textColor} 
                onDelete={handleDelete} 
                onCancel={onCancelPressed} 
            />
        </View>
            )
        globalModal.setContent(content,{type:'bottom'});    
        globalModal.toggle();
    }

    const handleCancel = () => {
        actionSheetRef.current?.dismiss();
    }

    const handleDelete = async () => {
        console.log("Deleted itemId :", itemId)
        //actionSheetRef.current.dismiss();
        globalModal.close();
        console.log('Hello arrive');
        navigation.goBack()

            const res = await deleteObject(itemId).catch((err) => { console.log(err) });
            console.log('DELETE_OBJECT_RESPONSE :', res);
            if (res.errCode == 200) {
                await removeItemFromUserFav(itemId)
                myToast(`${t(tns + ":" + "TOAST_DELETE")}`, "black", "white", 2000)
                const action = Actions.objectDelete(itemId);
                dispatch(action)
            }else if(res?.errCode == 403){
                const objectData = getObjectById(itemId)
                const objRdeps = objectData?.rdependencies
                const objInScenarios = objRdeps?.scenarios || []
                console.log('OBJECT_DATA_3 :', objRdeps?.scenarios);
    
                let message;
                const bgColor = 'red';
                const textColor = "white";
                const duration = 4000;
                console.log('LENGTH 1:');
                const listLengthOfScenarios = objInScenarios.length;
                console.log('LENGTH :', listLengthOfScenarios);
                if(listLengthOfScenarios != 0){
                    if( listLengthOfScenarios == 1){
                        const uri = objInScenarios[0]?.uri || ""
                        const routineId = Number(uri.split("/").pop())
                        const routine = getObjectById(routineId)
                        const routineName = routine?.name
                        console.log('SCENE :', routineName );
                        message = `${t(tns + ":" + "OBJECT_IN_USE_BY_A_SCENARIO")} '${routineName}'`
                    }else{message = `${t(tns + ":" + "OBJECT_IN_USE_BY_MULTI_SCENARIOS")}`}
                }else{
                    message = `${t(tns + ":" + "OBJECT_IN_USE")}`
                }
                myToast(message, bgColor, textColor, duration)
            }
       
    }

    const sendCurrentActive = (id) => {
        setActive(id);
    }

    const testColor = theme?.onBody || 'yellow';
    const borderColor = theme?.prflxBorderColor || 'orange';
    const bgcolor = theme?.prflxContaintBgColor || 'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor || "white";
    const textColor = theme?.prflxTextColor || 'black'

    let iconsCol1;
    let iconsCol2;
    const iconStop = [iconsJs.stopIcon];

    if (!traitsCheck?.includes("Position")) {
        iconsCol1 = [
            iconsJs.favIcon,
        ];
    } else {
        iconsCol1 = [
            iconsJs.favIcon,
            iconsJs.ajarIcon,
        ];
    }
    if (!traitsCheck?.includes("Position")) {
        isRoutine?
            iconsCol2 = [iconsJs.upIcon,iconsJs.downIcon] : iconsCol2 = [iconsJs.upIcon,iconsJs.stopIcon,iconsJs.downIcon]
    } else {
        iconsCol2 = [
            iconsJs.upIcon,
            iconsJs.open75perIcon,
            iconsJs.open50perIcon,
            iconsJs.open25perIcon,
            iconsJs.downIcon
        ];
    }

    const iconsCol3 = [
        iconsJs.bsoLame90degIcon,
        iconsJs.bsoLame67degIcon,
        iconsJs.bsoLame45degIcon,
        iconsJs.bsoLame22degIcon,
        iconsJs.bsoLame0degIcon,
    ]

    const onPressHandler = (id) => {
        console.log("Coucou :", id)
    }

    const onRequestClose = ()=>{
        setModalVisible(false)
    }
    const onRequestOpen = ()=>{
        setModalVisible(true)
    }


    const RenderShutterLevel = (props)=>{
        const {level} = props
        let myText;
        switch(level){
            case 0:
                myText = t(tns + ":" + "CLOSED");
                break
            case 100:
                myText = t(tns + ":" + "OPENED_AT");
                break;
            default:
                myText = t(tns + ":" + "OPENED_AT") + "  " + shutterLevel + '%'
               // myText = t(tns + ":" + "OPENED_AT") + '\n' + shutterLevel + '%'
        }
        return(
            <View style={{marginBottom:10, backgroundColor:'transparent', width:'100%'}}>
               <Text style={{fontSize:18, fontWeight:'600', color:textColor}}>
                    {myText}
               </Text>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.mainBody}>
            <View style={{
                position: 'absolute', zIndex: (connected == false || !netInfoIsConnected) ? 1 : 0,
                backgroundColor: (connected == false || !netInfoIsConnected) ? theme['card--color--deactivated-overlay'] : 'transparent',
                width: '100%', height: '100%', borderRadius: 12, opacity: 0.6
                }}
            />
              {/* {!connected && 
                <Text style={{textAlign:"center",backgroundColor:"transparent",width:"100%",marginBottom:10}}>{t("OBJECT_DISCONNECTED")}</Text>
            } */}
            <View>
            <View style={[styles.bodyWrapper, { flex: 1, backgroundColor: bgcolor, borderColor: borderColor }]}>
                {!isRoutine &&
                    <View style={{flexDirection:'row', justifyContent:"space-between", backgroundColor:'transparent', padding:10, alignItems:'center'}}>
                        <View>
                            {traits?.includes("Position") ?
                            
                                <View style={{backgroundColor:'transparent', flex:1, flexDirection:'row', width:150}}>
                                    { shutterLevel != undefined ?
                                        <RenderShutterLevel level ={Number(shutterLevel)} />
                                        :
                                        <Text numberOfLines={2}  style={{color:textColor,backgroundColor:'transparent', fontSize: 18, width:120,textAlign:'left', fontWeight: '600', marginBottom: 20 }}>
                                            {t(tns + ":" + "UNDEFINED_POSITION")}
                                        </Text>

                                    }

                                </View>
                                :
                                <Text style={{ fontSize: 18, fontWeight: '600', textAlign:'left', marginBottom: 20, color:textColor }}>
                                    {t(tns + ":" + "UNDEFINED_POSITION")}
                                </Text>
                            }
                        </View>

                        <View>
                            {traits?.includes("Rotation")&&
                                <View >
                                { angle != undefined ?
                                    <Text numberOfLines={2} style={{color:textColor,backgroundColor:'transparent', fontSize: 18, width:130, fontWeight: '600', textAlign:'right', marginBottom: 20 }}>
                                        {t(tns + ":" + "BLADES_ORIENTATION") + " " + angle + '\u00B0'}
                                    </Text>
                                    :
                                    <Text numberOfLines={3} style={{color:textColor,backgroundColor:'transparent', fontSize: 18, width:120, fontWeight: '600', textAlign:'right', marginBottom: 20 }}>
                                        {t(tns + ":" + "BLADES_ORIENTATION_UNDEFINED")}
                                    </Text>

                                }
                                </View>
                            }
                        </View>

                        {/* {(lockedByWindProtection && lockedByWindProtection =="wind_protect")&&
                            <View style={{width:35,height:35, backgroundColor:'transparent'}}>
                                {modeIcon["wind"]}
                            </View>
                        } */}

                    </View>

                }

                <View style={[styles.topBody]}>
                    {isRoutine?
                        <View  
                            style={{ width:'38%', 
                                    marginLeft: 10, backgroundColor: 'transparent',
                                }}
                            >
                            <RoutineWidgetIcon itemId={itemId} iconSize={73} isLabelUp={false} withBorder={true}/>
                        </View>
                        :
                        <View style ={{marginLeft:-10}}>
                        <RenderIconByState levelState={levelState} typeName={typeName} iconColor={textColor} iconSize={73}/>
                        </View>
                    }
                </View>

                <View style={styles.middleBody}>
                    <View>
                        {isRoutine ?
                            <RoutineWidgetLine
                                activeAction={activeAction}
                                itemId={itemId}
                                icons={iconsCol1}
                                iconSize={52}
                                onPress={handleOnPress}
                                onLongPress={handleOnLongPress}
                                active={sendCurrentActive}
                                iconWrapperStyle={[styles.iconDisplay, { borderColor: textColor }]}
                                iconGroupWrapperStyle={[styles.groupIconWrapper, { backgroundColor: lineWidgetBgColor, borderColor: textColor }]}
                                isShadow={true}
                            />
                            :
                            <View style={{}}>
                                <View>
                                    <MultiPurposeWidgetLine
                                        itemId = {itemId}
                                        icons={iconsCol1}
                                        iconSize={52}
                                        onPress={handleOnPress}
                                        onLongPress={handleOnLongPress}
                                        active={sendCurrentActive}
                                        iconWrapperStyle={[styles.iconDisplay, { borderColor: textColor }]}
                                        iconGroupWrapperStyle={[styles.groupIconWrapper, { backgroundColor: lineWidgetBgColor, borderColor: textColor }]}
                                        isShadow={true}
                                    />
                                </View>
                                {typeName != "Rolling_Shutter_Profalux" &&
                                
                                    <View style={{marginTop:20}}>
                                        <MultiPurposeWidgetLine
                                            itemId = {itemId}
                                            icons={iconStop}
                                            iconSize={52}
                                            onPress={handleOnPress}
                                            onLongPress={handleOnLongPress}
                                            active={sendCurrentActive}
                                            iconWrapperStyle={[styles.iconDisplay, { borderColor: textColor }]}
                                            iconGroupWrapperStyle={[styles.groupIconWrapper, { backgroundColor: lineWidgetBgColor, borderColor: textColor }]}
                                            isShadow={true}
                                        />
                                    </View>

                                }
                            </View>
                        }
                    </View>
                    <View>
                        {isRoutine ?
                            <RoutineWidgetLine
                                activeAction={activeAction}
                                itemId={itemId}
                                icons={iconsCol2}
                                iconSize={52}
                                onPress={handleOnPress}
                                onLongPress={handleOnPress}
                                active={sendCurrentActive}
                                iconWrapperStyle={[styles.iconDisplay, { borderColor: textColor }]}
                                iconGroupWrapperStyle={[styles.groupIconWrapper, { backgroundColor: lineWidgetBgColor, borderColor: textColor }]}
                                isShadow={true}
                            />
                            :
                            <MultiPurposeWidgetLine
                                itemId = {itemId}
                                icons={iconsCol2}
                                iconSize={52}
                                onPress={handleOnPress}
                                onLongPress={handleOnPress}
                                active={sendCurrentActive}
                                iconWrapperStyle={[styles.iconDisplay, { borderColor: textColor }]}
                                iconGroupWrapperStyle={[styles.groupIconWrapper, { backgroundColor: lineWidgetBgColor, borderColor: textColor }]}
                                isShadow={true}
                            />
                        }
                    </View>
                    {
                        isBSO &&
                        <View>
                            {isRoutine ?
                                <RoutineWidgetLine
                                    isTiltActive={activeAction}
                                    itemId={itemId}
                                    icons={iconsCol3}
                                    iconSize={52}
                                    onPress={handleOnPress}
                                    onLongPress={handleOnPress}
                                    active={sendCurrentActive}
                                    iconWrapperStyle={[styles.iconDisplay, { borderColor: textColor }]}
                                    iconGroupWrapperStyle={[styles.groupIconWrapper, { backgroundColor: lineWidgetBgColor, borderColor: textColor }]}
                                    isShadow={true}
                                />
                                :
                                <MultiPurposeWidgetLine
                                    itemId = {itemId}
                                    icons={iconsCol3}
                                    iconSize={52}
                                    onPress={handleOnPress}
                                    onLongPress={handleOnPress}
                                    active={sendCurrentActive}
                                    iconWrapperStyle={[styles.iconDisplay, { borderColor: textColor }]}
                                    iconGroupWrapperStyle={[styles.groupIconWrapper, { backgroundColor: lineWidgetBgColor, borderColor: textColor }]}
                                    isShadow={true}
                                />
                            }
                        </View>
                    }
                </View>
                {!isRoutine &&
                <View style={styles.footView}>
                    <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                        <Text style={[styles.textStyle,{color:textColor, textAlign:'center'}]}> {t(tns + ":" + "PRESS_FAV_HINT")}</Text>
                        <MultiPurposeWidgetLine
                            icons={[iconsJs.favIcon]}
                            isPressable={false}
                            iconSize={25}
                            onPress={handleOnPress}
                            onLongPress={handleOnPress}
                            active={sendCurrentActive}
                            iconWrapperStyle={[styles.iconDisplay]}
                            //iconWrapperStyle={[styles.iconDisplay, { position: 'absolute', left: 230, top: -33 }]}
                        />
                    </View>
                    <Text style={[styles.textStyle,{color:textColor, textAlign:'center'}]}> { isBSO? t(tns + ":" + "PRESS_FAV_BSO_ACTION") : t(tns + ":" + "PRESS_FAV_ACTION")}</Text>
                </View>
                }
            </View>
                  {(!connected ) &&
                    <View style={{position:"absolute",width:"100%",height:"100%",backgroundColor:"grey",opacity:0.4,borderRadius:12}} zIndex={12}>
                    </View>
                  }  
    </View>
                   
            <ModalSetFavPosition 
                modalVisible={modalVisible}  
                onRequestClose={ onRequestClose} 
                onRequestOpen = {onRequestOpen}
                objectName = {objectName}
                />
        </SafeAreaView>
    );

}
export default CommonShutterDetailsView;

const styles = StyleSheet.create({
    mainBody: {
        //height: '100%',
        borderRadius: 10,
        margin: 10,
    },
    bodyWrapper: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        padding: 23,
        borderWidth: 1,
        borderRadius: 12,
    },
    topBody: {
        backgroundColor: 'transparent',
        alignItems: 'flex-start',
    },
    middleBody: {
        backgroundColor: 'transparent',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 31,
        padding: 5
    },
    iconDisplay: {
        flexDirection: 'column',
        margin: 3,
        borderWidth: 1,
        borderRadius: 5,
        //backgroundColor:'white'
    },
    groupIconWrapper: {

        marginHorizontal: 12.5,
        borderRadius: 12,
        borderWidth: 1,
        // marginBottom:100

    },
    footView: {
        marginTop: 57,
        marginBottom: 54,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textStyle: {
        marginTop: 2,
        fontSize: 16,
    },

});