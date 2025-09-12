import React from 'react';
import { View,Text,StyleSheet, Pressable, Image} from 'react-native';
import { useTranslation } from 'react-i18next';

import { useTheme } from '_theming/themeProvider';
import { CardResponsive } from '_brand/templates/screens/addObject/components/CardResponsive';

export const ChoixDongleRadio868 = (props)=>{
    const {onPressNextArrow, textDisplay} = props;

    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
  
    const widgetbgColor = theme?.prflxwidgetbgColor||'white';
    const textColor = theme?.prflxTextColor||'black';

    
    return(
        <Pressable onPress={onPressNextArrow} style={{paddingHorizontal:12, justifyContent:'center', alignItems:'center', marginBottom:15}}>
            <CardResponsive 
                onPressNextArrow = {onPressNextArrow}
                >
                <View style={{ flexDirection:'row', }}>
                    <View style={{flex:1, flexDirection:'row', alignItems:'center', justifyContent:'space-around',}}>
                        <Image source={require('_brand/templates/screens/addObject/images/dongle868.png')} style={{width: 80, height: 80}}/>
                        <Text style={{width:200, flexWrap:'wrap', color:textColor, textAlign:'center', fontSize:16}}>
                            {textDisplay}
                        </Text>
                    </View>
                    
                    
                </View>
            </CardResponsive>
        </Pressable> 
    )
}

const styles = StyleSheet.create({

})