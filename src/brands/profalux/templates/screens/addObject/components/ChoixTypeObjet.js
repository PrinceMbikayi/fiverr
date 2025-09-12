import React from 'react';
import { View,Text,StyleSheet, Pressable, Image} from 'react-native';
import { useTranslation } from 'react-i18next';

import { useTheme } from '_theming/themeProvider';
import { CardResponsive } from '_brand/templates/screens/addObject/components/CardResponsive';

export const ChoixTypeObjet = (props)=>{
    const {onPressNextArrow, textDisplay, imgSource, imgStyle, doesUserHaveGateway} = props;

    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
  
    const widgetbgColor = theme?.prflxwidgetbgColor||'white';
    const textColor = theme?.prflxTextColor||'black'
    const imageUrl = "https://pixabay.com/fr/photos/usb-technology-blanche-flash-data-5029286/";


    
    return(

         //<View style = {{ backgroundColor:isGatewayPresent ? "transparent" : nonConnectedGray,borderColor:'orange',borderWidth:1, borderRadius:16,margin:10}}>
            <Pressable onPress={onPressNextArrow} style={{paddingHorizontal:10,backgroundColor:'transparent', paddingVertical:5, justifyContent:'center', alignItems:'center'}}>
                <CardResponsive 
                    onPressNextArrow = {onPressNextArrow}
                    doesUserHaveGateway = {doesUserHaveGateway}
                    >
                    <View style={{alignItems:'center', justifyContent:'center', backgroundColor:'transparent', width:'98%'}}>
                        <View style={{width:"100%",}}>
                            <Image source={imgSource ? imgSource: require( '_brand/images/app_logo.png')} style={imgStyle || {width: 80, height: 80}}/>
                            <Text style={[styles.text, {color:textColor, marginBottom:5}]}>
                                {textDisplay}
                            </Text>
                        </View>
                    </View>
                </CardResponsive>
        </Pressable> 
    //</View>
    )
}

const styles = StyleSheet.create({
   text:{
            fontSize:16,
            fontWeight:'400',
            alignItems:'center',
            justifyContent:'center',
            textAlign:'center',
            flexWrap:'wrap',
            lineHeight:20,
        },
  });