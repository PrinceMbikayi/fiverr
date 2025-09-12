import React from 'react';
import { TouchableHighlight, Text, View, Pressable, TouchableOpacity } from 'react-native';
import { useTheme } from '_theming/themeProvider';



export const MyButton = (props) => {

    const { title, containerStyle, titleStyle, titleColor, onPress, disabled} = props;

    const { theme } = useTheme();
    const testColor = theme?.onBody || 'yellow';
    const borderColor = theme?.prflxBorderColor || 'orange';
    const bgWhitecolor = theme?.prflxContaintBgColor || 'white';
    const bgcolor = theme?.prflxbgColor || 'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor || "white";
    const textColor = theme?.prflxTextColor || 'black'

    return (
        <TouchableOpacity
            onPress={onPress}
            onLongPress={onPress}
            disabled = {disabled}
            style={[containerStyle, { justifyContent: 'center', alignItems: 'center', backgroundColor: textColor, padding: 5, borderRadius: 14, minHeight: 45, padding:10 }]}
        >
            <Text style={[titleStyle, { textAlign: 'center', color: titleColor||'white', fontSize: 17, fontWeight: '400' }]}>{title}</Text>
        </TouchableOpacity>
    )
}