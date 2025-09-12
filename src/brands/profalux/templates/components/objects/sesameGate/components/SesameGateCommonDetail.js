import '_brand/templates/components/objects/common/locales'
import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { useTranslation } from 'react-i18next';
import { useTheme } from '_theming/themeProvider';
import { useSelector, useDispatch } from 'react-redux';

import { useObject } from '_hooks/object';

import { iconsJs } from '_brand/utils/iconsJs';
import { MultiPurposeWidgetLine } from "_brand/templates/components/objects/common/MultiPurposeWidgetLine";
import { deleteObject } from '_api/objects';
import * as Actions from '_actions/objects';
import Toast from 'react-native-root-toast';

import { RoutineWidgetLine } from "_brand/templates/components/objects/common/RoutineWidgetLine";
import {useScenario} from '_brand/templates/screens/routines/hook/useScenario'
import { getObjectById } from '_helpers/objects';
import { myToast } from '_brand/templates/components/ui/myToast';
import { RoutineWidgetIcon } from '_brand/templates/components/objects/common/RoutineWidgetIcon';

import { CommonBottomSheetDeleteContent } from '_brand/templates/components/objects/common/CommonBottomSheetDeleteContent';
import {useGlobalModal} from '_components/ui/globalModal'


export const SesameGateCommonDetail = (props) => {
    const { itemId, setKebab, traits } = props;

    const globalModal = useGlobalModal(); 

    const uScenario = useScenario();
    const { isRoutine, actionsByItemId } = uScenario;

    const dispatch = useDispatch();

    const gloIsConnected = useSelector(state => state?.network?.isConnected);
    const gloServerIsDown = useSelector(state => state?.network?.serverIsDown);
    const netInfoIsConnected = (gloIsConnected == true && gloServerIsDown == false);

    const uObject = useObject(itemId);
    const typeName = uObject?.objectDatas?.typeName;
    const connected = uObject?.objectDatas?.connected;
    console.log("UOBJECT TO CHECK :", uObject)
    const status = uObject?.statuses?.status;
    console.log(" GET_STATUS :", status);

    const [currentActive, setCurrentActive] = useState();
    const [stateIcon, setStateIcon] = useState([])
    const [statusMsg, setStatusMsg] = useState("");

    const { t, i18n } = useTranslation();
    const tns = "common";

    const { theme } = useTheme();
    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {};


    const icons = [
        iconsJs.upIcon,
        iconsJs.stopIcon,
        iconsJs.downIcon,
    ]

    useEffect(() => {

    }, [stateIcon])

    useEffect(() => {
        if (status == 'down' || status == 'close') {
            setStateIcon([iconsJs.garageCloseIcon]);
            const msg = `${t(tns + ":" + "HOME_GATE_CLOSED")}`
            setStatusMsg(msg)
        } else if (status == 'up' || status == 'open') {
            setStateIcon([iconsJs.garageOpenIcon]);
            const msg = `${t(tns + ":" + "HOME_GATE_OPENED")}`
            setStatusMsg(msg)
        } else {
            setStateIcon([iconsJs.garageSomewhereIcon]);
            const msg = `${t(tns + ":" + "HOME_GATE_AJAR")}`
            setStatusMsg(msg)
        }


    }, [currentActive, statusMsg, status,]);
    

    useEffect(() => {

    }, [stateIcon])



    


    const handleIconPress = (iconId) => {
        console.log("Pressed : ", iconId);

        if (iconId == 'OPEN/OPEN/'+`${itemId}`) {
            setCurrentActive(iconId);
            uObject?.execute("OPEN");
        }

        if (iconId == 'CLOSE/CLOSE/'+`${itemId}`) {
            setCurrentActive(iconId);
            uObject?.execute("CLOSE");
            //uObject?.execute("CLOSE");
        }
        if (iconId == "STOP/STOP/"+`${itemId}`) {
            setCurrentActive(iconId);
            uObject?.execute("STOP");
        }
    }


    const sendCurrentActive = (id) => {
        setActive(id);
    }

    const [actionActive, setActionActive] = useState(false)
    useEffect(() => {

    }, [actionActive])



    const shadow = {
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.8,
        elevation: 8,
        shadowColor: '#000000',
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
    const kebabDeleteAction = () => {
        console.log('No ACTION FOR NOW');
        onOpenSelect()
    }

    ////////////////////////
    // Show the setting icon on header of level 2 widget 
    useEffect(() => {

        if (setKebab) {
            setKebab(options)
        }
    }, []);
    /*
    const kebabUpdateAction = () => {
        navigation.navigate('ProductSettings', { 'typeName': typeName, itemId: itemId });
    }
    */
     const kebabUpdateAction = () => {
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

    const handleDelete = async () => {
        globalModal.close();
        console.log("Deleted itemId :", itemId)
        navigation.goBack()
        setTimeout(async()=>{
            const res = await deleteObject(itemId).catch((err) => { console.log(err) });
            console.log('DELETE_OBJECT_RESPONSE :', res);
            if (res.errCode == 200) {
                
                console.log('CHECK_POINT_DELETE 1', itemId);
                const action = Actions.objectDelete(itemId);
                dispatch(action)

                try{
                    await removeItemFromUserFav(itemId)
                }catch(err){console.log('Item not in favorite list');}
                Toast.show(
                    `${t(tns + ":" + "TOAST_DELETE")}`,
                    {
                        backgroundColor: 'black',
                        textColor: 'white',
                        textStyle: { fontSize: 16, fontWeight: '600' },
                        containerStyle: { width: '80%', height: 100, justifyContent: 'center', alignItems: 'center', borderRadius: 10, borderColor: borderColor, borderWidth: 2 },
                        position: Toast.positions.CENTER,
                        duration: 2000,
                    }
                );
                console.log('CHECK_POINT_DELETE 2', itemId);
                //dispatch(appRefresh());
            }else if(res?.errCode == 403){
                const objectData = getObjectById(itemId)
                const objRdeps = objectData?.rdependencies
                const objInScenarios = objRdeps?.scenarios || []
                console.log('OBJECT_DATA_2 :', objRdeps?.scenarios);
    
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

        },500)
    }


    const testColor = theme?.onBody || 'yellow';
    const borderColor = theme?.prflxBorderColor || 'orange';
    const bgcolor = theme?.prflxContaintBgColor || 'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor || "white";
    const textColor = theme?.prflxTextColor || 'black'

    return (
        //<CommonShutterDetailsView itemId={itemId} setKebab={setKebab}/>
        <SafeAreaView style={styles.mainBody}>
            <View style={{
                position: 'absolute', zIndex: (connected == false || !netInfoIsConnected) ? 1 : 0,
                backgroundColor: (connected == false || !netInfoIsConnected) ? theme['card--color--deactivated-overlay'] : 'transparent',
                width: '100%', height: '100%', borderRadius: 12, opacity: 0.6
            }}
            />
            <View style={[styles.bodyWrapper, { flex: 1, backgroundColor: bgcolor, borderColor: borderColor }]}>
                <View style={{ flexDirection: 'column', marginLeft: 5 }}>
                    <Text style={{ fontSize: 18, fontWeight: "600", color: textColor, flexWrap: 'nowrap', backgroundColor: 'transparent', textAlign: 'left', marginBottom:10 }}>
                        {statusMsg}
                    </Text>
                </View>
                <View style={styles.topBody}>
                    <MultiPurposeWidgetLine
                        icons={stateIcon}
                        iconSize={73}
                        isPressable={false}
                        active={sendCurrentActive}
                    />
                </View>

                <View style={styles.middleBody}>
                    <MultiPurposeWidgetLine
                        itemId={itemId}
                        icons={icons}
                        iconSize={52}
                        onPress={handleIconPress}
                        onLongPress={handleIconPress}
                        active={sendCurrentActive}
                        iconWrapperStyle={[styles.iconDisplay, { borderColor: textColor }]}
                        iconGroupWrapperStyle={[styles.groupIconWrapper, { backgroundColor: lineWidgetBgColor, borderColor: textColor }]}
                        isShadow={true}
                    />
                </View>

            </View>
        </SafeAreaView>
    );

}

const styles = StyleSheet.create({
    mainBody: {
        borderRadius: 10,
        margin: 10,
    },
    bodyWrapper: {
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 23,
        borderWidth: 2,
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
        marginTop: 50,
        padding: 5
    },
    iconDisplay: {
        flexDirection: 'column',
        margin: 10,
        borderWidth: 2,
        borderRadius: 7,
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
        fontSize: 18,
    }


});