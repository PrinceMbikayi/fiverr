import React from 'react';
import { View,Text, Image, Pressable} from 'react-native';
import { CardResponsive } from '_brand/templates/screens/addObject/components/CardResponsive';
import { useTheme } from '_theming/themeProvider';
import {iconsJs} from '_brand/utils/iconsJs';
import RoxNeosol from '_brand/images/icons/app/profaluxIconJs/RoxNeosol'
//import RoxNeosol from '_brand/images/icons/app/svg/RoxNeosol.svg'

export const CardImageWithArrow = (props)=>{
    const {
            ImageJs,imgWidth, imgHeight, sideText, sideTextBoxWidth, 
            bottomText, withArrow, onPressNextArrow, imgOnly, sideTextTitle, 
            imgMarginLeft, cardPading, id,iconColor, cardBgColor, disabled
        } = props;


    const { theme, baseColors } = useTheme();

    const borderColor = theme?.prflxBorderColor || 'orange';
    const bgcolor = theme?.prflxContaintBgColor || 'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor || "white";
    const textColor = theme?.prflxTextColor || 'black'


let content;

let card = (
        <Pressable 
            onLongPress={()=>onPressNextArrow(id)} 
            onPress={()=>onPressNextArrow(id)} 
            disabled={disabled}
            style={{flexDirection:'row', backgroundColor:'transparent', borderRadius:12}}
            >
            <View style={{justifyContent:"space-between", alignItems:'center', backgroundColor:'transparent',flex:1, marginLeft:imgMarginLeft||0, paddingVertical:cardPading}}>
            <View 
                style={{flexDirection:'row',padding:5,justifyContent:'space-between',alignItems:'center'}}
                >

                <View style={{flexDirection:'row', flex:1, justifyContent:'space-around', alignItems:'center'}}>
                    {ImageJs &&
                        <View style={{backgroundColor:'transparent', width:imgWidth || 150, height:imgHeight || 80, marginLeft:10}}>
                            <ImageJs color={iconColor}/>
                        </View>
                    }
                    <View style={{backgroundColor:'transparent',}}>
                        {sideTextTitle &&
                            <Text numberOfLines={1}  style={{width:sideTextBoxWidth||200, fontSize:18,fontWeight:'600', color:textColor, textAlign:'center'}}> 
                                {sideTextTitle}
                            </Text>
                        }

                        <View style={{flex:1, justifyContent:'center', alignItems:'center', width:sideTextBoxWidth||250, }}>
                            <Text  style={{fontSize:16,fontWeight:'400', color:textColor, textAlign:'center', }}> 
                                    {sideText}
                            </Text>
                        </View>
                    </View>
                </View>

            </View> 

            {bottomText &&
                <View>
                    <Text>
                        {bottomText}
                    </Text>
                </View>
            }
            </View>

            { withArrow &&
            <Pressable 
                    onPress={()=>onPressNextArrow(id)} 
                    disabled={disabled}
                    style={{ width:25, opacity:0.5, backgroundColor:'transparent', justifyContent:'center'}}
                >
                        <View style={{ height: 25}}>
                            <iconsJs.rightChevronIcon.name color={textColor} /> 
                        </View>
            </Pressable>
            }

        </Pressable>
    )

if(imgOnly){
    content = <View 
                style={{
                    backgroundColor:'transparent',justifyContent:'center',alignItems:'center', 
                    width:imgWidth || 150, height:imgHeight || 80, padding:10
                    }}
                >
                    <ImageJs/>
                </View>
}else{
    content = card
}



    return(
        <Pressable 
            onPress={onPressNextArrow} 
            disabled={disabled}
            style={{
                width:'100%',
                flexDirection:'row',
                backgroundColor:cardBgColor || "white", 
                borderColor:borderColor,
                borderWidth:1,
                borderRadius:16,
                padding:5,
                justifyContent: imgOnly ? 'flex-start' : 'center',
                alignItems:'center'
            }}
        >

          {content}
        </Pressable> 
    )
}
