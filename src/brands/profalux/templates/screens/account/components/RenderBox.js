import '_brand/templates/screens/_locales'
import React, {useEffect} from 'react';
import { View,Text,StyleSheet, Pressable, Image} from 'react-native';
import { useTranslation } from 'react-i18next';

import { useTheme } from '_theming/themeProvider';
import { CardResponsive } from '_brand/templates/screens/addObject/components/CardResponsive';
import { useObject } from '_hooks/object';

export const RenderBox = (props)=>{
    const {itemId, onPress, imgSource, imgStyle, boxName, boxIndex} = props;

    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
        const nonConnectedGray = theme?.prflxNonConnectedGray || '#CCC'

    const uObject = useObject(itemId);
    const connected = uObject?.connected;
    console.log('uObject', connected, uObject);

    useEffect(()=> {
        console.log('STATE_CONNCTED_CHANGED', connected);
    },[connected]);

    const textColor = theme?.prflxTextColor||'black'

    const handlePress = (id)=>{

    }
    
    return(

        <View style={{justifyContent:'flex-start', alignItems:'flex-start',backgroundColor:'transparent'}}>

            <View style={{ alignItems:'center', justifyContent:'flex-start', backgroundColor:'transparent',
                            width:'100%', flexDirection:'row', 
                        }}>
                <Image source={imgSource ? imgSource : require( '_brand/images/app_logo.png')} style={imgStyle || {width: 80, height: 80}}/>
                <Text numberOfLines={1} ellipsizeMode='tail' style={{fontSize:16, color:textColor, backgroundColor:'transparent', marginLeft:-25, width:250}}>
                {t("account:BOX")} {boxIndex} : SSID / {boxName}
                </Text>
            </View>
    </View> 
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