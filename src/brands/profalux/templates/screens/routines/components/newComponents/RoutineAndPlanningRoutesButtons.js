import '_brand/templates/screens/routines/locales'
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '_theming/themeProvider'



export const RoutineAndPlanningRoutesButtons = (props)=>{
    const {onPress, title, active} = props

    const { t, i18n } = useTranslation();
    const tns = "routine";

    const { theme } = useTheme();
    const textColor = theme?.prflxTextColor || 'black'

    const handleOnPress = (active)=>{
        onPress(active)
    }

    return(
        <View style={{ height:40, flexDirection: 'row', backgroundColor: '#aaa9a9', justifyContent: 'space-around', 
            alignItems: 'center', marginTop: 20, borderRadius: 10, padding: 2 }}
            >
            <Pressable
                onPress={()=>handleOnPress("routine")}
                style={{
                    backgroundColor:active == "routine"?'white':"transparent",
                    flex: 1, padding: 8, borderRadius: 10, width: '90%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row',
                }}>
                <Text style={{ color: textColor }}>{t(tns + ":" + "MY_ROUTINES")}</Text>
            </Pressable>
            <View style={{ borderRightWidth: 0.8, height: '50%', borderColor: textColor, marginHorizontal: 3 }}></View>
            <Pressable
                onPress={()=>handleOnPress("planning")}
                style={{
                    backgroundColor:active =="planning"? 'white' : "transparent" ,
                    flex: 1, padding: 8, borderRadius: 10, width: '90%', justifyContent: 'center', alignItems: 'center'
                }}>
                <Text style={{ color: textColor }}>{t(tns + ":" + "MY_PLANNING")}</Text>
            </Pressable>
        </View>
    )
}