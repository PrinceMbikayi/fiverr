import React from 'react';
import { View,Text, Image} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '_theming/themeProvider';
import { CardResponsive } from '_brand/templates/screens/addObject/components/CardResponsive';

export const SearchDongleScreen = (props)=>{
    const {onPressNextArrow, textDisplay} = props;

    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
  
    const widgetbgColor = theme?.prflxwidgetbgColor||'white';
    const textColor = theme?.prflxTextColor||'black'
    const imageUrl = "https://pixabay.com/fr/photos/usb-technology-blanche-flash-data-5029286/";

    return(

        <View  style={{paddingHorizontal:11, paddingVertical:5, justifyContent:'center', alignItems:'center',}}>
            <CardResponsive 
                onPressNextArrow = {onPressNextArrow}
                >
                <View style={{alignItems:'center', justifyContent:'center'}}>
                    <Image source={require('_brand/images/app_logo.png')} style={{width: 80, height: 80}}/>
                    <Text>
                        {textDisplay}
                    </Text>
                </View>
            </CardResponsive>
        </View> 
    )
}