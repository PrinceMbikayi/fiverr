import '_brand/templates/components/objects/common/locales'
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useObject } from '_hooks/object';
import { useTheme } from '_theming/themeProvider';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';

import { iconsJs } from '_brand/utils/iconsJs';
import { MultiPurposeWidgetLine } from "_brand/templates/components/objects/common/MultiPurposeWidgetLine";
import { RenderIconByState } from "_brand/templates/components/objects/common/RenderIconByState";
import {useScenario} from '_brand/templates/screens/routines/hook/useScenario'
import {executeAction} from '_brand/templates/components/objects/common/utils/executeAction'
import {RenderLevelPosition} from "_brand/templates/components/objects/shutters/components/RenderLevelPosition"


/**
 * Shutter Details content 
 * 
 * @param {Object} props
 * @param {number} props.itemId
 * @param {object} props.statuses
 * @param {UseObject} props.uObject
 * 
 */
export const CommonShutterWidgetView = (props) => {
    const { itemId, isScenario, sendScenarioAction, iconList } = props;
    const route = useRoute();
    const routeName = route.name;
    const { t, i18n } = useTranslation();
    const tns = "common";
    const { theme } = useTheme();

    const gloIsConnected = useSelector(state => state?.network?.isConnected);
    const gloServerIsDown = useSelector(state => state?.network?.serverIsDown);
    const netInfoIsConnected = (gloIsConnected == true && gloServerIsDown == false);
    const textColor = theme?.prflxTextColor || 'black'

    const uObject = useObject(itemId);
    const statusDictionary = uObject?.objectDatas?.statusDictionary
    const typeName = uObject?.objectDatas?.typeName;
    const connected = uObject?.objectDatas?.connected;
    const shutterLevel = uObject?.statuses?.level
    let levelState = shutterLevel ? Number(shutterLevel) : shutterLevel
    const shutterName = uObject?.name;
    const status = uObject?.statuses?.status
    const traits = uObject?.objectDatas?.traits;

    const lockedByWindProtection = uObject?.statuses?.__lock_message
    //const lockedByWindProtection = statusDictionary?.__lock_message
    console.log('USE_OBJECT_TRACK_WIND :',uObject, shutterName, lockedByWindProtection);
    
    const modeIcon ={
        "wind":<iconsJs.windSockIcon.name color={"orange"||textColor}/>,
    }
    
    const [currentActive, setCurrentActive] = useState();
    let  icons = [iconsJs.upIcon,iconsJs.stopIcon,iconsJs.downIcon,iconsJs.favIcon]

    useEffect(()=> {
        console.log(`LOCK_MESSAGE : ${shutterName} :`,  lockedByWindProtection);
    },[lockedByWindProtection]);

    useEffect(() => {
    }, [currentActive]);

    useEffect(()=> {
        console.log('Shutter Level Changed :', shutterName,  shutterLevel);
    },[shutterLevel]);

    const handleIconPress = (iconId) => {
        setCurrentActive(iconId);
        executeAction(iconId,uObject)
    }

    const sendCurrentActive = (id) => {
        setActive(id);
    }

    return (
        <Pressable 
            disabled={true} onPress={() => console.log("Tuile Pressed")}     
            style={{ justifyContent: 'center', alignItems: 'center', marginHorizontal:0,width:'100%',backgroundColor:'transparent', borderRadius: 12}}>
            <View style={{
                    flex: 1, width: '100%', backgroundColor: 'transparent', flexDirection: 'row', alignItems: 'center',
                    justifyContent: 'space-between', borderRadius: 12,
                }}
                >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginLeft: 0, backgroundColor: 'transparent', paddingRight:4, height:'100%' }}>
                    <RenderIconByState levelState={levelState} typeName={typeName} iconColor={textColor} iconSize={48}/>
                </View>
                <View style={{backgroundColor: 'transparent', width:'18%', height:'100%'}}>
                        {(lockedByWindProtection && lockedByWindProtection =="wind_protect")?
                            <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center', flex: 1}}>
                                <View style={{width:25,height:25, backgroundColor:'transparent'}}>
                                    {modeIcon["wind"]}
                                </View>
                            </View>
                            :
                            <>
                                {traits?.includes("Position") &&
                                    <View style={{ flexDirection: 'column', flex: 1, justifyContent: 'center', alignItems: 'center', padding: 0 }}>
                                        <RenderLevelPosition shutterLevel={shutterLevel}/>
                                    </View>
                                }
                            </>
                        }
                </View>
                <View style={{ backgroundColor: 'transparent', alignItems:'flex-end',justifyContent:'flex-start', nominWidth:200}}>

                        <View style={{flexDirection:'row', backgroundColor:'transparent', padding:2,flex:1, justifyContent:'flex-start', alignItems:'center'}}>
                            <View style={{flex:1, justifyContent:'center',alignItems:'center', backgroundColor:'transparent'}}>
                                <Text
                                    style={{
                                        alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent', marginBottom: 5, marginTop: 0,
                                        fontSize: 14, fontWeight: "400", flexWrap: 'wrap', color: textColor
                                    }}
                                    >
                                    {shutterName}
                                </Text>
                            </View>

                            {/* {(lockedByWindProtection && lockedByWindProtection =="wind_protect")&&
                                <View style={{width:22,height:22, backgroundColor:'transparent'}}>
                                    {modeIcon["wind"]}
                                </View>
                            } */}
                        </View>
                    


                    <View style={{ flex: 1, flexDirection: 'row', marginRight:10 }}>
                        <View style={{ marginLeft: 10 }}>
                            <MultiPurposeWidgetLine
                                itemId={itemId}
                                icons={iconList||icons}
                                isPressable={true}
                                onPress={handleIconPress}
                                onLongPress={handleIconPress}
                                active={sendCurrentActive}
                                iconWrapperStyle={[styles.iconDisplay, { borderColor: textColor }]}
                                iconGroupWrapperStyle = {[styles.groupIconWrapper]}
                                isShadow={true}
                            />
                        </View>
                    </View>
                </View>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    iconDisplay: {
        flexDirection: 'row',
        marginLeft: 0,//5
        marginTop: 5,
        marginBottom: 5,
        borderWidth: 1,
        borderRadius: 7,
        justifyContent: 'space-evenly'
    },
    groupIconWrapper: {
        flexDirection: 'row',
        backgroundColor: 'transparent'
    },

})