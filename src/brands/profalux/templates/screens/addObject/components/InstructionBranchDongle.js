import React from 'react';
import { View,Text,StyleSheet,Image} from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getLoadedObjects} from '_helpers/selectors';

import { useTheme } from '_theming/themeProvider';
import { CardResponsive } from '_brand/templates/screens/addObject/components/CardResponsive';

export const InstructionBranchDongle = (props)=>{
    const {onPressNextArrow} = props;

    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
  
    const widgetbgColor = theme?.prflxwidgetbgColor||'white';
    const textColor = theme?.prflxTextColor||'black'
    const imageUrl = "https://pixabay.com/fr/photos/usb-technology-blanche-flash-data-5029286/";

    const loadObjects =  useSelector(getLoadedObjects);

    return(

        <View  style={{paddingHorizontal:11, paddingVertical:5, justifyContent:'center', alignItems:'center',}}>
            <CardResponsive 
                //onPressNextArrow = {handleNextPress}
                withNextArrow = {false}
                innerWidthPercent={'85%'}
                >
                <View style={{alignItems:'center', justifyContent:'center'}}>
                    <Image source={require('_brand/templates/screens/addObject/images/imgBoxCalypshome.png')} style={{width: 230, height: 138}}/>
                </View>
            </CardResponsive>
            {/* <View style={[styles.validateButton, {color:textColor}]}>
                <Button onPress={handleValidateScan} altStyle titleColor='white' title='Valider' bgColor={textColor} noBorder />
            </View> */}
        </View> 
    )
}


const styles = StyleSheet.create({
        validateButton:{
            width:200,
            height:50,
            marginTop:200
        }
  });