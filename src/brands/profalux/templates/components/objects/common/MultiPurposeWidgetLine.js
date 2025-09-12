import React, { useState, useRef, useEffect } from "react";
import { View, Text, Pressable, Dimensions } from 'react-native';
import { useTheme } from '_theming/themeProvider';
/**
 * This component render an svg icon that has been converted to JS component
 * 
 * @param {Object} props
 * @param {Array} props.icons list of icons object [{id, name}]
 * @param {string} props.iconColor icon color, default is icon theme color 
 * @param {number} props.iconSize icon square size, default 40
 * @param {object} props.iconWrapperStyle icon wrapper style object
 * @param {object} props.iconGroupWrapperStyle icons group wrapper style  
 * @param {Function} props.onPress callback function when icon is pressed : send icon id
 * @param {boolean} props.isPressable is it a button or just an icon?
 * @param {boolean} props.isShadow  add shadow to iconWrapperStyle
 * 
 */
export const MultiPurposeWidgetLine = (props) => {
    const { icons,itemId, iconColor,activeBgColor, iconBgColor, iconSize, 
            iconWrapperStyle, iconGroupWrapperStyle, onPress, onLongPress, 
            isPressable = true, isShadow = false 
        } = props;

    const [active, setActive] = useState(-1);
    const { theme } = useTheme();
    const timeOutRef = useRef([]);
    const DEVICE_WIDTH = Dimensions.get('window').width;;
    useEffect(() => {
        // mount
        return () => {
            // unmount
            console.log("cleaned up");
            (timeOutRef.current).map((item) => {
                clearTimeout(item);
            })
        };
    }, []);

    const handlePress = (id) => {
        console.log("I am Pressed hh :", id)
        onPress(id);
        setActive(id);
        const timer1 = setTimeout(() => setActive(-1), 3000);
        timeOutRef.current = [...timeOutRef.current, timer1]
    }

    const handleLongPress = (id) => {
        onLongPress(id)
        setActive(id);
        const timer2 = setTimeout(() => setActive(-1), 3000);
        timeOutRef.current = [...timeOutRef.current, timer2]
    }

    const iconthemeColor = theme?.prflxIconColor || 'white';
    const iconthemebgColor = 'white';
    const shadow = {
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        elevation: 4,
        shadowColor: '#000000',
    }

    let marginH ;
    if(DEVICE_WIDTH >= 390){
        marginH = 7;
    }else{marginH = 3}

    return (
        <View style={[iconGroupWrapperStyle || { flexDirection: 'row', backgroundColor: 'transparent', justifyContent: 'space-evenly', alignItems: 'center'}]}>
            {
                icons.map((icon,index) => {
                    const idForTest = icon.id + "/" + itemId;
                    return (
                        <View key={index} style={{backgroundColor:'transparent', justifyContent:'space-between', alignItems:'center', minWidth:40, marginHorizontal:marginH}}>
                                <Pressable
                                    disabled={isPressable ? false : true}
                                    onPress={() => handlePress(icon.id + "/" + itemId)}
                                    onLongPress={() => handleLongPress(icon.id + "/" + itemId)}
                                    style={[
                                        isShadow ? shadow : {},
                                        iconWrapperStyle,
                                        {
                                            width: iconSize || 38, height: iconSize || 38,
                                            backgroundColor: active === idForTest ? activeBgColor || iconColor || iconthemeColor : iconBgColor || iconthemebgColor,
                                            //backgroundColor: active === idForTest ? iconColor || iconthemeColor : iconBgColor || iconthemebgColor,
                                        }
                                    ]}
                                >
                                    <icon.name color={active === idForTest ? iconthemebgColor : iconColor || iconthemeColor} />
                                    {/* <icon.name color={active === idForTest ? iconthemebgColor : iconColor || iconthemeColor} /> */}
                                </Pressable>
                        </View>
                    );
                })
            }
        </View>
    )
}
