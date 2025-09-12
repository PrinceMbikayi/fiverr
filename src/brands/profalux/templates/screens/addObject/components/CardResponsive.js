import React from 'react';
import { View,StyleSheet, Pressable} from 'react-native';

import { useTheme } from '_theming/themeProvider';
import {iconsJs} from '_brand/utils/iconsJs';

export const CardResponsive = (props)=>{
    const {onPressNextArrow, innerWidthPercent, sideWidthPercent,borderWidth, 
        withNextArrow = true, disabled, children,
        doesUserHaveGateway ,
    } = props;

    let isGatewayPresent = doesUserHaveGateway || true;
    if(doesUserHaveGateway != undefined){
        isGatewayPresent = doesUserHaveGateway;
    }
    if(isGatewayPresent == undefined){
        isGatewayPresent = true;
    }

    const { theme } = useTheme();
  
    const widgetbgColor = theme?.prflxwidgetbgColor||'white';
    const textColor = theme?.prflxTextColor||'black';
    const nonConnectedGray = theme?.prflxNonConnectedGray || '#CCC'


    
    return(
        <View style = {{backgroundColor:isGatewayPresent ? "white" : "white"||nonConnectedGray,borderColor:'orange',borderWidth:1, borderRadius:16,paddingHorizontal:5, margin:5}}>
            <View style={{paddingHorizontal:0, opacity:isGatewayPresent ? 1: 0.2, backgroundColor:'transparent', borderRadius:16, justifyContent:'center', alignItems:'center',}}>
                <View  style = {[styles.cardView,  {backgroundColor:widgetbgColor, width:borderWidth ,alignItems:'center', justifyContent:'center'}]} >
                                <View style={ [ styles.cardInnerView, {width: innerWidthPercent||( withNextArrow?'90%':'100%'), height:'100%', backgroundColor:"white"||widgetbgColor,padding:5} ]}>
                                   { children }
                                </View>
                                { withNextArrow &&
                                    <View style={[styles.sideView, {maxWidth:sideWidthPercent || '10%', backgroundColor:'transparent', margin:8}]}>
                                        <Pressable disabled={disabled} onPress={onPressNextArrow} style={{ width: 22, height: 25, opacity:0.5}}>
                                            <iconsJs.rightChevronIcon.name color={textColor} />
                                        </Pressable>
                                    </View>
                                }
                </View>
            </View>
       </View>
    )
}

const styles = StyleSheet.create({
    cardView:{
        flexDirection:'row',
        borderRadius:16,
        //borderColor:'orange',
        //borderWidth:1,
        padding:0
    },
    cardInnerView:{
        borderRadius:16,
        justifyContent:'space-between',
        alignItems:'center'
    },
    sideView:{
        //flex:1,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:16,
    }
})