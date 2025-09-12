
import '_brand/templates/components/objects/common/locales'
import React from 'react';
import { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useObject } from '_hooks/object';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '_theming/themeProvider';
import { iconsJs } from '_brand/utils/iconsJs';
import { MultiPurposeWidgetLine } from "_brand/templates/components/objects/common/MultiPurposeWidgetLine";
import { GraphDataForChartKit } from '_brand/utils/GraphDataForChartKit';
import { BottomDeleteSheet } from '_brand/templates/components/objects/common/BottomDeleteSheet';
import { deleteObject } from '_api/objects';
import * as Actions from '_actions/objects';
import Toast from 'react-native-root-toast';
import { removeItemFromUserFav } from '_brand/utils/removeItemFromUserFav';
import { CommonBottomSheetDeleteContent } from '_brand/templates/components/objects/common/CommonBottomSheetDeleteContent';
import {useGlobalModal} from '_components/ui/globalModal'
import { myToast } from '_brand/templates/components/ui/myToast';
import { getObjectById } from '_helpers/objects';


export const TempLightSensorDetail = (props) => {

    const { itemId, setKebab } = props;
    const uObject = useObject(itemId);
    //console.log("UOBJECT CAPTEUR :", uObject)
    const statuses = uObject?.statuses

    const temperature = statuses?.temperature;
    const illumi = statuses?.illuminance

    const approxTemp = temperature!=undefined ? temperature: "--"
    //const approxTemp = temperature!=undefined ? Math.round(temperature): "--"
    const illuminance = illumi!=undefined ? illumi: "--"




    const globalModal = useGlobalModal();  
    const typeName = uObject?.objectDatas?.typeName
    const { theme } = useTheme();
    const { t, i18n } = useTranslation();
    const tns = "common";
    const navigation = useNavigation();


    const [dataName, setDataName] = useState("")


    // $$$$$$$$$$$$$$$
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
                  nameToDelete={`${t(tns+":"+"THIS_SENSOR")}`} 
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
        globalModal.close();
        console.log("Deleted itemId :", itemId)
        navigation.goBack()
        const res = await deleteObject(itemId).catch((err) => { console.log(err) });
        if (res.errCode == 200) {
            await removeItemFromUserFav(itemId)
            myToast(`${t(tns + ":" + "TOAST_DELETE")}`, "black", "white", 2000)
            const action = Actions.objectDelete(itemId);
            dispatch(action)
            //navigation.goBack()
        }else if(res?.errCode == 403){
            const objectData = getObjectById(itemId)
            const objRdeps = objectData?.rdependencies
            const objInEcoConfort = objRdeps?.applications || []
            let message;
            const bgColor = 'red';
            const textColor = "white";
            const duration = 4000;
            console.log('LENGTH 1:');
            const listLengthOfEcoConfort = objInEcoConfort.length;
            console.log('LENGTH :', listLengthOfEcoConfort);
            if(listLengthOfEcoConfort != 0){
                if( listLengthOfEcoConfort == 1){
                    const uri = objInEcoConfort[0]?.uri || ""
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

    // $$$$$$$$$$$$$$$


    const screenWidth = Dimensions.get('window').width;


    const borderColor = theme?.prflxBorderColor || 'orange';
    const Containerbgcolor = theme?.prflxContaintBgColor || 'white';
    const bgcolor = theme?.prflxbgColor || 'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor || "white";
    const textColor = theme?.prflxTextColor || 'black'
    const headerBgColor = theme?.prflxHeaderBackground || '#FFFFFF'

    const onDefaultImageError = () => {

    }




    return (
        <SafeAreaView style={{ height: '100%', backgroundColor: bgcolor }}>
            <View style={[styles.bodyWrapper, { backgroundColor: Containerbgcolor, borderColor: borderColor, marginHorizontal: 0 }]}>
                <View style={{
                    flex: 1, width: '100%', backgroundColor: 'transparent', flexDirection: 'row', alignItems: 'center',
                    justifyContent: 'space-between', borderRadius: 12, marginBottom: 20, marginTop: 10
                }}>
                    <View style={{ flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', marginLeft: 15, backgroundColor: 'transparent' }}>
                        <MultiPurposeWidgetLine
                            isPressable={false}
                            icons={[iconsJs.sensorTLIcon]}
                            iconSize={73}
                            //onPress = {handleIconPress} 
                            //onLongPress = {handleIconPress}
                            //active = {sendCurrentActive}
                            iconWrapperStyle={[{ borderColor: textColor }]}
                            iconGroupWrapperStyle={[{ alignItems: 'center', justifyContent: 'center', borderColor: 'transparent', borderWidth: 1, backgroundColor: 'transparent' }]}
                            isShadow={false}
                        />
                    </View>
                    <View style={{ flex: 1, paddingHorizontal: 10, justifyContent: 'center'}}>
                        {temperature &&
                            <View style={{ flexDirection: 'row', marginBottom: 15, justifyContent: 'space-evenly', alignItems: 'center' }}>
                                <View><Text style={{ fontSize: 14, fontWeight: '400' }}>{t(tns + ":" + "TEMPERATURE")} :</Text></View>
                                <View><Text style={{ fontSize: 20, fontWeight: '600' }}>{approxTemp} </Text></View>
                                <View><Text style={{ fontSize: 14, fontWeight: '600' }}>°C</Text></View>
                            </View>
                        }
                        {illumi &&
                            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                                <Text style={{ fontSize: 14, fontWeight: '400' }}>{t(tns + ":" + "BRIGHTNESS")} :</Text>
                                <Text style={{ fontSize: 20, fontWeight: '600' }}>{illuminance}</Text>
                                <Text style={{ fontSize: 14, fontWeight: '600' }}> lux</Text>
                            </View>
                        }
                    </View>
                </View>

                {/* GRAPH */}
                <View style={{ alignItems: 'center', justifyContent: 'space-around', padding: 0, flex: 1 }}>
                    <View>
                        <GraphDataForChartKit itemId={itemId} isProfaluxTempLightSensor={true} />
                        {/* <GraphDataForChartKit itemId={itemId} rangeType="day" onSelect={(feature) => console.log(" Feature Selected :", feature)} /> */}
                    </View>
                    {/* <View>
                        <Graphs objectId = {itemId} typeName={typeName} dataName ={dataName}/>
                    </View>  */}
                </View>
                {/* <BottomDeleteSheet
                    myRef={actionSheetRef}
                    handleCancel={handleCancel}
                    handleDelete={handleDelete}
                /> */}
            </View>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    bodyWrapper: {
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 12,
        paddingVertical: 5,
        marginTop: 10,
    },
    groupIconWrapper: {
        flexDirection: 'row',
        backgroundColor: 'transparent'
    },
})
