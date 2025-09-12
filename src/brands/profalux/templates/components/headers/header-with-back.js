import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';


import { useNavigation, useRoute, StackActions } from '@react-navigation/native';
// import { useDeviceOrientation } from '@react-native-community/hooks';
//import {useWindowDimensions} from 'react-native';


import { useTheme } from '_theming/themeProvider';
import { HeaderButton } from '_components/headers/header-button';
import { ShadowBorder } from '_components/ui/shadow-border';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { iconsJs } from '_brand/utils/iconsJs';
import { MultiPurposeWidgetLine } from '_brand/templates/components/objects/common/MultiPurposeWidgetLine';


/**
 * 
 * @param {Object} props 
 * @param {string} props.title 
 * @param {string} [props.backIcon] - default "chevron-left"
 * @param {boolean} [props.backSVG] - display arrowLeft from brand app icon
 * @param {boolean} [props.noBack] - hide back
 * @param {number} [props.backIconSize] - default 40
 * @param {string} [props.bgColor] - default theme["header--color--bg"]
 * @param {string} [props.color] - default theme['drawer--color--text']
 * @param {boolean} [props.noShadow] - default false
 * @param {any} [props.screenHeaderButtons] - a JSX node
 * @param {object} [props.extraButtons] - an array to build extraButtons i.e. settings
 * @param {boolean} [props.backDoClose] - Go to previous Stack
 * @param {boolean} [props.themeDependency] - default false
 * @param {boolean} [props.centered] - title is centered
 * @returns a header with back
 */




export const HeaderWithBack = (props) => {

    const { theme, baseColors } = useTheme();

    const testColor = theme?.onBody || 'yellow';
    const borderColor = theme?.prflxBorderColor || 'orange';
    const bgcolor = theme?.prflxContaintBgColor || 'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor || "white";
    const textColor = theme?.prflxTextColor || 'black'

    const { headerBackgroundColor, headerTextColor } = baseColors;

    const {
        title,fontSize, noShadow, themeDependency, pop,
        backIcon = "chevron-left",
        backSVG, noBack, objectMenu,
        color = textColor,
        bgColor = (themeDependency) ? headerBackgroundColor || theme["header--color--bg"] : "transparent",
        backIconSize = 40,
        extraButtons = [],
        kebab = null,
        centered,
        isPagerViewGoBack,
        isOther = false,
        handleOther,
        titleMarginLeft,
    } = props;

    // Catch itemId and typeName
    const navigation = useNavigation();
    const route = useRoute();
    const navParams = route.params;
    // const { itemId, typeName } = navParams;

    const previousRoute = useSelector(state => state.app.previousRoute)

   // const orientation = useDeviceOrientation()


    const _close = () => {
        if (props.close !== null) {
            if (props.close.action != undefined) {
                props.close.action()
            } else {
                //default

                handleBackToPreviousScreen();
            }

        } else {
            // nothing close is not shown
        }
    }

    const _goBack = () => {


        if (props.goBack) {
            if (props.goBack.action != undefined) {
                props.goBack.action()
            } else {
                navigation.goBack();
            }

        } else {
            if (props.backDoClose) {
                handleBackToPreviousScreen();
            } else {
                console.log('DEFAULT GO BACK');
                navigation.goBack();
            }
        }
    }




    const handleBackToPreviousScreen = () => {

        navigation.dispatch(StackActions.popToTop());
        //then go to previous Stack View
        if (previousRoute) navigation.navigate(previousRoute);

    }

    const buildExtraButtons = () => {
        if (extraButtons.length == 0) return <View style={{ width: 40 }} />;

        const options = extraButtons;

        return (
            <View style={{ backgroundColor: 'transparent', minWidth: 40, height: 32, marginRight: 15, alignItems: 'center', alignContent: 'center' }}>
                <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row' }}>
                    {options.map((v, i) => {
                        return (

                            <HeaderButton callback={v.action} img={v.icon} svgr={v.svgr} key={"hwb_" + title + "_" + i} fillColor={color} iconSize={24} />

                        )
                    })
                    }
                </View>
            </View>
        )
    }

    const [builtExtraButtons, setBuiltExtraButtons] = useState(buildExtraButtons())


    const RenderMenu = () => {
        return objectMenu
    }

    const RenderNoBack = () => {
        return null
    }

    const RenderBack = () => {
        return (
            <View style={{ backgroundColor: 'transparent', height: 50, justifyContent: 'center' }}>
                <MultiPurposeWidgetLine
                    icons={[iconsJs.leftChevronIcon]}
                    iconSize={25}
                    onPress={_goBack}
                    onLongPress={_goBack}
                    //active = {sendCurrentActive}
                    iconWrapperStyle={{ backgroundColor: 'transparent' }}
                />
            </View>
        )
    }

    const RenderBackIcon = () => {
        return (
            <Icon name={backIcon} size={backIconSize} color={color} />
        )
    }



    return (
        <View style={{ height: 55 }}>
            <View style={{ flex: 1, backgroundColor: 'white', borderBottomColor: borderColor, borderBottomWidth: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', width: '100%'}}>
                <TouchableOpacity onPress={() => _goBack()} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center',}}>
                    {/* {backIconDisplayed} */}
                    {objectMenu &&
                        <RenderMenu />
                    }
                    {noBack ?
                        <RenderNoBack />
                        :
                        <>
                            {backSVG ?
                                <RenderBack />
                                :
                                <RenderBackIcon />
                            }
                        </>
                    }
                </TouchableOpacity>
                
                <View style={{ backgroundColor: 'transparent', flex: 1, marginLeft:titleMarginLeft,  width: '100%' }}>
                    <Text numberOfLines={2} ellipsizeMode='tail' style={{ color: textColor, fontSize: fontSize ? fontSize:19, fontWeight: '600', backgroundColor: 'transparent' }}>
                        {title}
                    </Text>
                </View>

                {props.close &&
                    <TouchableOpacity onPress={() => _close()} style={{ flex: 1, justifyContent: "flex-end", marginRight: 10, flexDirection: 'row', alignItems: 'center', width: 40, maxWidth: 40 }}>
                        <Icon name="close" size={32} color={color} />
                    </TouchableOpacity>
                }
                {props.screenHeaderButtons &&
                    <View style={{ marginRight: 15, backgroundColor: 'transparent', justifyContent: 'flex-end', flexDirection: 'row' }}>
                        {
                            props.screenHeaderButtons
                        }
                    </View>
                }
                {
                    builtExtraButtons
                }
                {kebab &&
                    <View style={{ backgroundColor: 'transparent', minWidth: 40, height: 32, alignItems: 'center', alignContent: 'center' }}>
                        {kebab}
                    </View>
                }
                {
                    isOther &&
                    <View style={{ backgroundColor: 'transparent' }}>
                        <MultiPurposeWidgetLine
                            icons={[iconsJs.kebabIcon]}
                            iconSize={25}
                            onPress={handleOther}
                            //active = {sendCurrentActive}
                            iconWrapperStyle={{ backgroundColor: 'transparent' }}
                        />
                    </View>
                }
                {/* {!noShadow &&
                    <ShadowBorder ratio={orientation.portrait} themeDependency={themeDependency} />
                } */}

            </View>
        </View>
    )
}
