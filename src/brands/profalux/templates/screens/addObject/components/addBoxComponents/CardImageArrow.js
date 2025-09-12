import React from 'react';
import { View,Text, Image, Pressable} from 'react-native';
import { CardResponsive } from '_brand/templates/screens/addObject/components/CardResponsive';
import { useTheme } from '_theming/themeProvider';

export const CardImageArrow = (props)=>{
    const {
            onPressNextArrow, textDisplay, textDisplay2, textStyle, withNextArrow,inerStyle, borderWidth,
            imageSource,imageSource2,imgStyle2, innerWidthPercent, imgStyle, children, label, disabled, justiMyContent
        } = props;


    const { theme, baseColors } = useTheme();

    const testColor = theme?.onBody || 'yellow';
    const borderColor = theme?.prflxBorderColor || 'orange';
    const bgcolor = theme?.prflxContaintBgColor || 'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor || "white";
    const textColor = theme?.prflxTextColor || 'black'

    const handleOnPressNextArrow = ()=>{
        onPressNextArrow(label)
    }

    return(
        <Pressable disabled={disabled} onPress={handleOnPressNextArrow} style={{ paddingHorizontal:0, justifyContent:'center', alignItems:'center', marginBottom:5, backgroundColor:'transparent'}}>
            <CardResponsive 
                onPressNextArrow = {handleOnPressNextArrow}
                withNextArrow = {withNextArrow}
                disabled={disabled}
                innerWidthPercent = {innerWidthPercent}
                borderWidth = {borderWidth}
                >
                <View style={[inerStyle,{ flexDirection:'row', marginLeft:1,backgroundColor:'transparent'}]}>
                    <View style={{flex:1, flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                        {
                            imageSource &&
                            <View style={{ flexDirection:'row', justifyContent: justiMyContent ||'flex-start', alignItems:'center', flex:1, padding:0}}>
                                <View >
                                    <Image source={imageSource} style={imgStyle ||{width: 70, height: 70}}/>
                                </View>
                                {imageSource2 &&
                                    <View style={{height:70,width:'80%', justifyContent:'center', alignItems:'flex-start', marginLeft:5}}>
                                        <Image source={imageSource2} style={imgStyle2}/>
                                    </View>
                                }
                            </View>
                        }
                        <View style={{flexDirection:'column'}}>
                            {textDisplay &&
                                <View style={{backgroundColor:'transparent'}}>
                                    <Text style={[textStyle,{flexWrap:'wrap',color:textColor, textAlign:'center', fontSize:16, fontWeight:'400'},]}>
                                        {textDisplay}
                                    </Text>
                                </View>
                            }
                            {textDisplay2 &&
                                <View style={{backgroundColor:'transparent'}}>
                                    <Text style={[textStyle,{flexWrap:'wrap', color:textColor, textAlign:'center', fontSize:16, fontWeight:'400'},]}>
                                        {textDisplay2}
                                    </Text>
                                </View>
                            }
                        </View>
                    </View>
                    
                    
                </View>
                {children}
            </CardResponsive>
        </Pressable> 
    )
}
