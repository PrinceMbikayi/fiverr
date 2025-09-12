import '_brand/templates/components/objects/common/locales'
import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '_theming/themeProvider';
import {useSelector,useDispatch} from "react-redux";
import { useObject } from '_hooks/object';
import { iconsJs } from '_brand/utils/iconsJs';
import { MultiPurposeWidgetLine } from "_brand/templates/components/objects/common/MultiPurposeWidgetLine";
import { BottomDeleteSheet } from '_brand/templates/components/objects/common/BottomDeleteSheet';
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


export const GarageCommonDetail = (props) => {
    const { itemId, setKebab, traits } = props;

    const globalModal = useGlobalModal(); 
    const uScenario = useScenario();
    const { isRoutine, actionsByItemId } = uScenario;

    const gloIsConnected = useSelector(state => state?.network?.isConnected);
    const gloServerIsDown = useSelector(state => state?.network?.serverIsDown);
    const netInfoIsConnected = (gloIsConnected == true && gloServerIsDown == false);
    const dispatch = useDispatch();
    
    // Shutter Object all infos
    const uObject = useObject(itemId);
    const typeName = uObject?.objectDatas?.typeName;
    const connected = uObject?.objectDatas?.connected;
    console.log("UOBJECT TO CHECK :", uObject)
    const traitsCheck = uObject?.objectDatas?.traits;
    const shutterLevel = uObject?.statuses?.level
    const status = uObject?.statuses?.status;
    const typeNature = uObject?.statuses?.__user_typeNature;
    let picto868;
    if (typeNature == "store") {
        picto868 = [iconsJs.store868Icon]
    } else if (typeNature == "bso") {
        picto868 = [iconsJs.bso868Icon]
    } else { picto868 = [iconsJs.vr868Icon] }

    const [currentActive, setCurrentActive] = useState();
    const [levelMessage, setLevelMessage] = useState("");
    const [stateIcon, setStateIcon] = useState([])
    const [isToggleMode, setIsToggleMode] = useState(!traits?.includes("Open")) // true => non toggle
    const [statusMsg, setStatusMsg] = useState("");

    const { theme } = useTheme();
    const { t, i18n } = useTranslation();
    const tns = "common";
    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {};

    const icons = [
        iconsJs.upIcon,
        iconsJs.downIcon,
    ]

    useEffect(() => {
    }, [stateIcon])

    useEffect(() => {
        if (status == 'down' || status == 'closed') {
            setStateIcon([iconsJs.garageCloseIcon]);
            const msg = `${t(tns + ":" + "GARAGE_CLOSED")}`
            setStatusMsg(msg)
        } else if (status == 'up' || status == 'open') {
            setStateIcon([iconsJs.garageOpenIcon]);
            const msg = `${t(tns + ":" + "GARAGE_OPENED")}`
            setStatusMsg(msg)
        } else {
            setStateIcon([iconsJs.garageSomewhereIcon]);
            const msg = `${t(tns + ":" + "GARAGE_AJAR")}`
            setStatusMsg(msg)
        }

    }, [currentActive, statusMsg, status,]);

    useEffect(() => {
    }, [stateIcon])

    const handleIconPress = (iconId) => {
        console.log("Pressed : ", iconId);

        if (iconId =="OPEN/OPEN/"+`${itemId}`) {
            setCurrentActive(iconId);
            //uObject?.execute("ACTION",{mArgs:[{name:'level',value:10}]});
            if(isRoutine){
            }else{
                uObject?.execute("OPEN");
            }
        }

        if (iconId =="CLOSE/CLOSE/"+`${itemId}`) {
            setCurrentActive(iconId);
            if(isRoutine){
            }else{
                uObject?.execute("CLOSE");
            }
        }
    }

    const sendCurrentActive = (id) => {
        setActive(id);
    }

    const [actionActive, setActionActive] = useState(false)
    useEffect(() => {

    }, [actionActive])
    const handleActionPress = () => {
        uObject?.execute("ACTION");
        setActionActive(true)
        setTimeout(() => {
            setActionActive(false)
        }, 1000)
        console.log("Action Press");

    }

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
    const actionSheetRef = useRef(null);

    const kebabDeleteAction = () => {
        //actionSheetRef.current?.present()
        onOpenSelect()
    }

    ////////////////////////
    // Show the setting icon on header of level 2 widget 
    useEffect(() => {
        if (setKebab) {
            setKebab(options)
        }
    }, []);

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


    const handleCancel = () => {
        console.log('Delete canceled');
        actionSheetRef.current?.dismiss();
    }

    const handleDelete = async () => {
        // alert("Really wanna delete?")
        globalModal.close()
        console.log("Deleted itemId :", itemId)
        navigation.goBack()
        setTimeout(async()=>{

            const res = await deleteObject(itemId).catch((err) => { console.log(err) });
            console.log('DELETE_OBJECT_RESPONSE :', res);
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
                const action = Actions.objectDelete(itemId);
                dispatch(action)
            }else if(res?.errCode == 403){
                const objectData = getObjectById(itemId)
                const objRdeps = objectData?.rdependencies
                const objInScenarios = objRdeps?.scenarios || []
                console.log('OBJECT_DATA_1 :', objRdeps?.scenarios);
    
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
        //console.log('item deleted ', itemId);
        //actionSheetRef.current?.dismiss();
    }


    const testColor = theme?.onBody || 'yellow';
    const borderColor = theme?.prflxBorderColor || 'orange';
    const bgcolor = theme?.prflxContaintBgColor || 'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor || "white";
    const textColor = theme?.prflxTextColor || 'black'


    const handleRoutinePress = () => {
        console.log("YUUUUPIIII")
    }



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
                {!isRoutine && 
                <Text style={{ fontSize: 20, fontWeight: "bold", color: textColor, backgroundColor: 'transparent', textAlign: 'left', marginBottom: 10 }}>
                    {statusMsg}
                    {/* {t(tns+":"+"OPENED_AT")+ '\n'+shutterLevel+'%'} */}
                </Text>
                
                }

                <View style={styles.topBody}>
                    {isRoutine?
                        <View  
                            style={{ width:'38%', 
                                   backgroundColor: 'transparent',
                                }}
                            >
                            <RoutineWidgetIcon itemId={itemId} iconSize={73} isLabelUp={false} withBorder={false}/>
                        </View>
                        :
                        <MultiPurposeWidgetLine
                            icons={stateIcon}
                            iconSize={73}
                            isPressable={false}
                            active={sendCurrentActive}
                        />
                    }
                </View>

                <View style={styles.middleBody}>
                    {isToggleMode ?
                        <View style={{
                            backgroundColor: '#EBF1F5', borderColor: '#3E495E',
                            borderWidth: 1, borderRadius: 12, height: 113, width: 177, justifyContent: 'center', alignItems: 'center'
                        }}>

                            <>
                                {isRoutine ?
                                    <RoutineWidgetLine
                                        //activeAction={activeAction}
                                        itemId={itemId}
                                        icons={icons}
                                        isPressable={true}
                                        onPress={handleRoutinePress}
                                        onLongPress={handleRoutinePress}
                                        //active={sendCurrentActive}
                                        iconWrapperStyle={[styles.iconDisplay, { borderColor: textColor }]}
                                        //iconGroupWrapperStyle = {[styles.groupIconWrapper]}
                                        isShadow={true}
                                    />
                                    :
                                    <Pressable
                                        onPress={handleActionPress}
                                        style={{
                                            width: 107, height: 40, borderColor: '#3E495E', borderWidth: 0.3, borderRadius: 7,
                                            justifyContent: 'center', alignItems: 'center', marginBottom: 8, marginTop: 5,
                                            backgroundColor: actionActive ? textColor : 'white',
                                            shadowColor: "#000",
                                            shadowOffset: {
                                                width: 0,
                                                height: 5,
                                            },
                                            shadowOpacity: 0.34,
                                            shadowRadius: 6.27,
                                            elevation: 10,
                                        }}
                                    >
                                        <Text style={{ fontSize: 16, fontWeight: '600', color: actionActive ? 'white' : textColor }}>{t(tns + ":" + "GARAGE_DOOR_ACTION")}</Text>
                                    </Pressable>

                                }
                            </>
                        </View>

                        :

                        <View style={{flexDirection:'column'}}>
                            {isRoutine ?
                                <View>
                                    <RoutineWidgetLine
                                        //activeAction={activeAction}
                                        itemId={itemId}
                                        icons={icons}
                                        isPressable={true}
                                        onPress={handleIconPress}
                                        onLongPress={handleIconPress}
                                        //active={sendCurrentActive}
                                        iconWrapperStyle={[styles.iconDisplay, { borderColor: textColor }]}
                                        iconGroupWrapperStyle={[styles.groupIconWrapper, { backgroundColor: lineWidgetBgColor, borderColor: textColor }]}
                                        isShadow={true}
                                    />
                                </View>

                                :

                                <View>
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
                            }
                        </View>

                    }
                </View>

            </View>

            {/* <BottomDeleteSheet
                myRef={actionSheetRef}
                handleCancel={handleCancel}
                handleDelete={handleDelete}
            /> */}
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


});