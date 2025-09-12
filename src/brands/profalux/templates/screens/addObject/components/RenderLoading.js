import '_brand/templates/screens/addObject/locales'
import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '_theming/themeProvider';
import { MyButton } from '_brand/templates/components/ui/MyButton';



export const RenderLoading = (props) => {
    const {cancelLoading, topText, bgColor} = props;
    const navigation = useNavigation();

    const { t, i18n } = useTranslation();
    const tns = "addObject";

    const { theme } = useTheme();
    const bgcolor = theme?.prflxbgColor || 'white';
    const textColor = theme?.prflxTextColor || 'black'

    const handleCancelLoading = () => {
        // navigation.navigate("BluetoothActivationWarningScreen")
        navigation.navigate("garageDoorBleAssistantHomeScreen")
    }
    return (
        <View style={{ marginTop: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: bgColor || bgcolor, }}>
            <Text style={[styles.text, { marginTop: 20, marginBottom: 60 }]}>
               {topText}
            </Text>
            <ActivityIndicator size="large" color='#3E495E' style={{ transform: [{ scaleX: 2 }, { scaleY: 2 }] }} />
            <View style={{ width: "60%", marginTop: 200, marginBottom:20}}>
                <MyButton onPress={handleCancelLoading} title={t(tns + ":" + "CANCEL")} />
                <View style={{width:300, height:40}}></View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({

    text: {
        fontSize: 16,
        fontWeight: '400',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        flexWrap: 'wrap',
        lineHeight: 20,
        marginVertical: 10,
        color: '#3E495E'
    }
});