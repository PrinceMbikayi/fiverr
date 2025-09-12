import React from 'react';
import { View, StyleSheet} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { useTheme } from '_theming/themeProvider';
import { HeaderWithBack } from '_brand/templates/components/headers/header-with-back';


export const HeaderScreen = (props)=>{

    const {title,fontSize, goBack, isOther, handleOther, withBack=true} = props;

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
        <View style={[styles.headerStyle, {backgroundColor:headerBgColor,  borderBottomColor:borderColor}]}>
            {withBack ==true ?
                <HeaderWithBack
                    title={title}
                    fontSize={fontSize}
                    //noBack
                    backSVG 
                    centered 
                    goBack={{ action: goBack }}
                    noShadow
                    isOther = {isOther}
                    handleOther = {handleOther}
                />
                :
                <HeaderWithBack
                    title={title}
                    noBack
                    fontSize={fontSize}
                    noShadow
                    titleMarginLeft={20}
                    isOther = {isOther}
                    handleOther = {handleOther}
                />
            }
        </View>
    )
}

const styles = StyleSheet.create({
    headerStyle:{
        justifyContent:'flex-end',
        backgroundColor:"#FFFFFF",
        marginTop:-20,
        //height:'10%',
        width:'100%'
      },
})
