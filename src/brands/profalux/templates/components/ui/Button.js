import React from 'react';
import { TouchableHighlight, Text, View, Pressable } from 'react-native';
import { useTheme } from '_theming/themeProvider';

/**
 * 
 * @param {object} props 
 * @param {string} props.title 
 * @param {function} props.onPress
 * @param {string} [props.bgColor] 
 * @param {object} [props.titleStyle]
 * @param {string} [props.titleColor]  
 * @param {boolean} [props.altStyle]  
 * @param {boolean} [props.noBorder]  
 * @returns 
 */
const Button = (props) => {

    const { theme, baseColors } = useTheme();

    const { altStyle, noBorder, title, titleColor = "black", titleStyle = {},

        bgColor = altStyle ? 'transparent' : theme?.primary_1_light,
        justWidth,
        icon = null,
        onPress, disabled } = props

    const borderColor = (noBorder) ? 'transparent' : (altStyle) ? titleColor : bgColor || theme?.primary_1_light;

    const JustWidth = (props) => {
        if (justWidth) {
            return (
                <View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 20 }}>
                        {props.children}
                    </View>
                </View>
            )
        }
        return props.children
    }

    const extraPadding = justWidth ? 20 : 0;

    return (
        <JustWidth>
            <TouchableHighlight onPress={onPress} disabled={disabled} style={[containerStyle, { paddingLeft: 8, paddingRight: 8, backgroundColor: bgColor, borderColor: borderColor, borderWidth: 1, opacity: disabled ? 1 : 1 }]} activeOpacity={1}
                underlayColor="#272D39">
                <View style={{ flexDirection: 'row' }}>
                    {icon &&
                        <View style={{ marginRight: 8 }}>{icon}</View>
                    }
                    <Text style={[textStyle, { textAlign: 'center', color: titleColor, paddingLeft: extraPadding, paddingRight: extraPadding, ...titleStyle }]}>{title}</Text>

                </View>
            </TouchableHighlight>
        </JustWidth>
    );
}

export default Button;

const containerStyle = { minHeight: 44, height: 44, borderRadius: 16, paddingRight: 8, paddingLeft: 8, alignItems: 'center', justifyContent: 'center', marginTop: 8 };
const textStyle = { fontSize: 17, fontWeight: '400' }