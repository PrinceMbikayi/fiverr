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
import { RenderGroupIconByState } from "_brand/templates/components/objects/common/RenderGroupIconByState";

/**
 * Shutter Details content 
 * @param {Object} props
 * @param {number} props.itemId
 * @param {object} props.statuses
 * @param {UseObject} props.uObject
 * 
 */
export const CommonShuttersGroupWidget = (props) => {
    const { itemId } = props;
    const route = useRoute();
    const routeName = route.name;
    const { t, i18n } = useTranslation();
    const tns = "common";
    const { theme } = useTheme();

    const gloIsConnected = useSelector(state => state?.network?.isConnected);
    const gloServerIsDown = useSelector(state => state?.network?.serverIsDown);
    const netInfoIsConnected = (gloIsConnected == true && gloServerIsDown == false);

    const borderColor = theme?.prflxBorderColor || 'orange';
    const bgcolor = theme?.prflxContaintBgColor || 'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor || "white";
    const textColor = theme?.prflxTextColor || 'black'

    console.log("PIXEL HAAA", itemId);
    const uObject = useObject(itemId);
    const typeName = uObject?.objectDatas?.typeName;
    const shutterName = uObject?.name;
    const traits = uObject?.objectDatas?.traits;
    const typeNature = uObject?.statuses?.__user_typeNature;

    const groupStatus = uObject?.objectDatas?.statusDictionary?.groupStatus
    const uniType = uObject?.objectDatas?.uniType
    const groupTypeName = uObject?.objectDatas?.groupTypeName
    const groupComponentTypes = uObject?.objectDatas?.componentTypes || []

    console.log('GROUP_TYPENAME :', groupTypeName, uObject);
    

    const [currentActive, setCurrentActive] = useState();


    useEffect(() => {

    }, [currentActive]);

    let picto868;
    if (typeNature == "store") {
        picto868 = [iconsJs.store868Icon]
    } else if (typeNature == "bso") {
        picto868 = [iconsJs.bso868Icon]
    } else { picto868 = [iconsJs.vr868Icon] }

    let icons = [
        iconsJs.upIcon,
        iconsJs.stopIcon,
        iconsJs.downIcon,
        iconsJs.favIcon,

    ]

    const handleIconPress = (iconId) => {

        setCurrentActive(iconId);
        switch (iconId) {
            case 'OPEN/OPEN/' + `${itemId}`:
                uObject?.execute("OPEN");
                break;

            case 'STOP/STOP/' + `${itemId}`:
                uObject?.execute("STOP");
                break;

            case 'CLOSE/CLOSE/' + `${itemId}`:
                uObject?.execute("CLOSE");
                break;

            case 'FAV_CALL_1/FAV_CALL_1/' + `${itemId}`:
                uObject?.execute("FAV_CALL_1");
                break;
            default:
                console.log('End');
        }

    }

    const sendCurrentActive = (id) => {
        setActive(id);
    }





    return (
        <Pressable disabled={true} onPress={() => console.log("Tuile Pressed")} style={{ justifyContent: 'center', alignItems: 'center', marginHorizontal: 0, borderRadius: 12 }}>

            <View style={{
                flex: 1, width: '100%', backgroundColor: 'transparent', flexDirection: 'row', alignItems: 'center',
                justifyContent: 'space-between', borderRadius: 12,
            }}
            >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginLeft: 0, backgroundColor: 'transparent', paddingRight: 4, height: '100%' }}>

                    <RenderGroupIconByState 
                        iconColor={textColor}
                        iconSize={48}
                        groupId={itemId}
                        groupTypeName={groupTypeName}
                        uniType={uniType}
                        componentTypes={groupComponentTypes}
                        groupStatus={groupStatus}
                    />
                </View>
                <View style={{ backgroundColor: 'transparent' || 'purple', alignItems: 'flex-end', justifyContent: 'flex-start', nominWidth: 200 }}>
                    <View style={{ backgroundColor: 'transparent', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <Text
                            style={{
                                alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent', marginBottom: 5, marginTop: 0,
                                fontSize: 14, fontWeight: "400", flexWrap: 'wrap', color: textColor
                            }}
                        >
                            {shutterName}
                        </Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', marginRight: 10 }}>
                        <View style={{ marginLeft: 0 }}>
                            <MultiPurposeWidgetLine
                                itemId={itemId}
                                icons={icons}
                                isPressable={true}
                                onPress={handleIconPress}
                                onLongPress={handleIconPress}
                                active={sendCurrentActive}
                                iconWrapperStyle={[styles.iconDisplay, { borderColor: textColor }]}
                                iconGroupWrapperStyle={[styles.groupIconWrapper]}
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
        marginLeft: 0,
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