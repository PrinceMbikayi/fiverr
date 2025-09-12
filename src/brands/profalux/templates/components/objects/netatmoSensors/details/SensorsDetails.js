import '_brand/templates/components/objects/common/locales'
import React from 'react';
import { useEffect, useState, useRef } from 'react';
import { View, Text, Image, Pressable, StyleSheet, ScrollView, Dimensions, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useObject } from '_hooks/object';
import { useNavigation, useRoute } from '@react-navigation/native';


import { useTheme } from '_theming/themeProvider';
import { iconsJs } from '_brand/utils/iconsJs';
import { MultiPurposeWidgetLine } from "_brand/templates/components/objects/common/MultiPurposeWidgetLine";
import { GraphDataForChartKit } from '_brand/utils/GraphDataForChartKit';
//import { IconRender } from "./IconRender";

import { BottomDeleteSheet } from '_brand/templates/components/objects/common/BottomDeleteSheet';
import { deleteObject } from '_api/objects';
import * as Actions from '_actions/objects';
import Toast from 'react-native-root-toast';
import { removeItemFromUserFav } from '_brand/utils/removeItemFromUserFav';
import { CommonBottomSheetDeleteContent } from '_brand/templates/components/objects/common/CommonBottomSheetDeleteContent';
import {useGlobalModal} from '_components/ui/globalModal'


export const SensorsDetails = (props) => {

    const { itemId, setKebab } = props;
    const uObject = useObject(itemId);

     const globalModal = useGlobalModal();  
    const { theme } = useTheme();
    const { t, i18n } = useTranslation();
    const tns = "common";
    const navigation = useNavigation();

    console.log("UOBJECT_DETAIL_SENSOR :", uObject)

    const statuses = uObject?.statuses
    const typeName = uObject?.objectDatas?.typeName || ""
    const approxTemp = Math.round(statuses?.temperature) ? Math.round(statuses?.temperature) : "--"
    const pressure = Math.round(statuses?.pressure) ? Math.round(statuses?.pressure) : "--"
    const noise = statuses?.noise ? statuses?.noise : "--"
    const co2 = Math.round(statuses?.co2) ? Math.round(statuses?.co2) : "--"
    const humidity = statuses?.humidity ? statuses?.humidity : '--'
    const wind_speed = statuses?.wind_speed ? statuses?.wind_speed : "--";
    const wind_dir = statuses?.wind_direction ? statuses?.wind_direction : "--";
    const wind_gust = statuses?.wind_gust ? statuses?.wind_gust : "--";
    const rainrate = statuses?.rainrate ? statuses?.rainrate : "--";
    const battery = statuses?.battery ? statuses?.battery : "--"




    const [dataName, setDataName] = useState("")

    const sensorTypeInfos = [
        {
            typeName: "NetatmoStation",
            icon: [iconsJs.indoorSensorIcon],
            features: [{ name: `${t(tns + ":" + "TEMPERATURE")}`, value: approxTemp, unit: '°C' }, { name: "Humidite", value: humidity, unit: '%' }, { name: 'Pression', value: pressure, unit: 'Pa' }, { name: 'CO2', value: co2, unit: 'ppm' }, { name: 'Bruit', value: noise, unit: 'dB' }]
        },
        {
            typeName: "NetatmoIndoorProbe",
            icon: [iconsJs.indoorSensorIcon],
            features: [{ name: `${t(tns + ":" + "TEMPERATURE")}`, value: approxTemp, unit: '°C' }, { name: "Humidite", value: humidity, unit: '%' }, { name: 'Pression', value: pressure, unit: 'Pa' }, { name: 'CO2', value: co2, unit: 'ppm' }, { name: 'Bruit', value: noise, unit: 'dB' }]
        },
        {
            typeName: "NetatmoOutdoorProbe",
            icon: [iconsJs.outdoorSensorIcon],
            features: [{ name: `${t(tns + ":" + "TEMPERATURE")}`, value: approxTemp, unit: '°C' }, { name: "Humidite", value: humidity, unit: '%' }]
        },

        {
            typeName: "NetatmoRainGauge",
            icon: [iconsJs.rainGaugeSensorIcon],
            features: [{ name: "Pluie", value: rainrate, unit: "mm/h" }]
        },
        {
            typeName: "NetatmoWindGauge",
            icon: [iconsJs.windGaugeSensorIcon],
            features: [{ name: "Rafales", value: wind_gust, unit: "km/h" }, { name: "Vitesse du vent", value: wind_speed, unit: "km/h" }, { name: "Direction du vent", value: wind_dir }]
        }
    ]


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
        globalModal.close()
        console.log("Deleted itemId :", itemId)
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
                }
            );
            navigation.goBack()
            const action = Actions.objectDelete(itemId);
            dispatch(action)
        }
        //console.log('item deleted ', itemId);
        //actionSheetRef.current?.dismiss();
    }

    // $$$$$$$$$$$$$$$


    const screenWidth = Dimensions.get('window').width;


    const borderColor = theme?.prflxBorderColor || 'orange';
    const Containerbgcolor = theme?.prflxContaintBgColor || 'white';
    const bgcolor = theme?.prflxbgColor || 'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor || "white";
    const textColor = theme?.prflxTextColor || 'black'
    const headerBgColor = theme?.prflxHeaderBackground || '#FFFFFF'



    return (
        <SafeAreaView style={{ height: '100%', backgroundColor: bgcolor }}>
            <View style={[styles.bodyWrapper, { backgroundColor: Containerbgcolor, borderColor: borderColor, marginHorizontal: 0 }]}>

                <View style={{
                    flex: 1, width: '100%', backgroundColor: 'transparent', flexDirection: 'row', alignItems: 'center',
                    justifyContent: 'space-between', borderRadius: 12, marginBottom: 20, marginTop: 10
                }}
                >

                    {sensorTypeInfos.map((item, index) => {
                        if (typeName == item?.typeName) {
                            return (
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }} key={index}>
                                    <View style={{ flexDirection: 'column', marginLeft: 15, backgroundColor: 'transparent' }}>
                                        <MultiPurposeWidgetLine
                                            isPressable={false}
                                            icons={item?.icon}
                                            iconSize={73}
                                            iconWrapperStyle={[{ borderColor: textColor }]}
                                            iconGroupWrapperStyle={[{ alignItems: 'center', justifyContent: 'center', borderColor: 'transparent', borderWidth: 1, backgroundColor: 'transparent' }]}
                                            isShadow={false}
                                        />
                                    </View>
                                    <View style={{ flex: 1, paddingHorizontal: 10 }}>
                                        {(item?.features).map((feat, idx) => {
                                            return (
                                                <View key={idx} style={{ flexDirection: 'row', marginBottom: 15, justifyContent: 'space-evenly', alignItems: 'center' }}>
                                                    <View style={{ width: 100, backgroundColor: 'transparent', alignItems: 'flex-end' }}>
                                                        <Text style={{ fontSize: 14, fontWeight: '400' }}>{feat?.name} :</Text>
                                                    </View>
                                                    <View style={{ width: 50, backgroundColor: 'transparent', alignItems: 'flex-end' }}>
                                                        <Text style={{ fontSize: 20, fontWeight: '600' }}>{feat?.value} </Text>
                                                    </View>
                                                    <View style={{ width: 50, backgroundColor: 'transparent', alignItems: 'flex-end' }}>
                                                        <Text style={{ fontSize: 14, fontWeight: '600' }}>{feat?.unit}</Text>
                                                    </View>
                                                </View>
                                            )
                                        })}
                                    </View>
                                </View>
                            )
                        }
                    })
                    }
                </View>

                {/* GRAPH */}
                <View style={{ alignItems: 'center', justifyContent: 'space-around', padding: 0, flex: 1 }}>
                    <View>
                        <GraphDataForChartKit itemId={itemId} rangeType="day" onSelect={(feature) => console.log(" Feature Selected :", feature)} />
                    </View>
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
        //flex:1,
        //flexDirection:'column',
        //alignItems:'center',
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
