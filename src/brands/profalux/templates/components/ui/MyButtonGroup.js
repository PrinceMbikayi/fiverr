import React, { useState, useEffect } from 'react';
import { TouchableHighlight, Text, View, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '_theming/themeProvider';



export const MyButtonGroup = (props) => {

    const { containerStyle, onPress, buttons, isActive } = props;

    const { theme } = useTheme();
    const testColor = theme?.onBody || 'yellow';
    const borderColor = theme?.prflxBorderColor || 'orange';
    const bgWhitecolor = theme?.prflxContaintBgColor || 'white';
    const bgcolor = theme?.prflxbgColor || 'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor || "white";
    const textColor = theme?.prflxTextColor || 'black'

    //const [clickedId, setClickedId] = useState(2);

    const handleClick = (item) => {
        //setClickedId(item.id);
        onPress(item)
    }

    // useEffect(()=> {

    // },[clickedId]);


    return (
        <View style={styles.container}>
            {
                buttons.map((item) => {
                    return (
                        <Pressable
                            key={item.id}
                            onPress={() => handleClick(item)}
                            style={[
                                isActive == item.id ? [styles.buttonActive, { backgroundColor: textColor }] : styles.button,
                                containerStyle,]}
                        >
                            <Text style={isActive == item.id ? [styles.textActive, { color: 'white' }] : [styles.text, { color: textColor }]}>{item.label}</Text>
                        </Pressable>
                    )
                })
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        //flex:1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingVertical: 10
        //alignItems:'center'
    },
    buttonActive: {
        borderWidth: 1,
        borderColor: '#d7d7d9',
        width: 60,
        height: 25,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5
    },
    button: {
        borderWidth: 1,
        borderColor: '#d7d7d9',
        width: 60,
        height: 25,
        backgroundColor: 'white',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5
    },
    text: {
        textAlign: 'center',
        color: 'white',
        fontSize: 14,
        fontWeight: '400'
    },
    textActive: {
        textAlign: 'center',
        color: 'white',
        fontSize: 14,
        fontWeight: '400'
    }
})