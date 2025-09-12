import React from 'react';
import { View,StyleSheet, ScrollView} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { useTheme } from '_theming/themeProvider';


export const Body = (props)=>{

    const {children, style} = props;

    const {theme} = useTheme();  
    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {};

    const testColor = theme?.onBody||'yellow';
    const borderColor = theme?.prflxBorderColor||'orange';
    const containerBgcolor = theme?.prflxContaintBgColor||'white';
    const bgcolor = theme?.prflxbgColor||'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor||"white";
    const textColor = theme?.prflxTextColor||'black';
    const headerBgColor = theme?.prflxHeaderBackground || '#FFFFFF'
    const iconColor = theme?.prflxIconColor || "#3E495E";
    const iconBgColor = theme?.prflxIconbgColor || "#FFFFFF";


    return(
        <ScrollView  showsVerticalScrollIndicator={false} style={{height:'100%', width:'100%', backgroundColor:'transparent'}}>
            <View style={[{justifyContent:'space-between', alignItems:'center'}, style]}>
                {children}
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    headerStyle:{
        flex:1,
        justifyContent:'flex-end',
        borderBottomColor:'orange',
        borderBottomWidth:2,
        backgroundColor:"#FFFFFF",
        marginTop:-20,
        width:'100%'
      },
})
