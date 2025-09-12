import React from 'react';
import { View, Text, Pressable} from 'react-native';
import { MultiPurposeWidgetLine } from "_brand/templates/components/objects/common/MultiPurposeWidgetLine";
import { useTheme } from '_theming/themeProvider';


export const RenderObjectTypeChoice = (props)=>{
    const {id, index, bgColor, iconColor, handlePress, IconJS, title, borderColor, borderWidth} = props;
    const callBack = ()=>{
        handlePress(id);
    }

    const { theme } = useTheme();

    //const borderColor = theme?.prflxBorderColor || 'orange';
    const containerbgcolor = theme?.prflxContaintBgColor || 'white';
    const bgcolor = theme?.prflxbgColor || 'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor || "white";
    const textColor = theme?.prflxTextColor || 'black'
    const headerBgColor = theme?.prflxHeaderBackground || '#FFFFFF'
    //const iconColor = theme?.prflxIconColor || "#3E495E";
    const iconBgColor = theme?.prflxIconbgColor || "#FFFFFF";


    const shadow = {
        shadowOffset:{width: 0, height: 4},
        shadowOpacity: 0.5,
        elevation:4,
        shadowColor:'#000000',
    }
    return(
        <Pressable 
            onPress = {callBack} onLongPress={callBack}  
            key={index}
            style={{
                shadow, paddingVertical:15,paddingHorizontal:5, margin:10,
                justifyContent:'space-around', alignItems:'center', 
                borderColor:"orange", borderWidth:borderWidth,
                borderRadius:12, width:85,height:105, backgroundColor:iconColor
            }} 
            >
                <View style={{justifyContent:'center', alignItems:'center', marginVertical:0, backgroundColor:'transparent', minHeight:40, flexWrap:'nowrap'}}>
                    <Text numberOfLines={2} ellipsizeMode='tail' style={{ textAlign:'center', color:"#3E495E", fontSize:14, fontWeight:'600'}}>{title}</Text>
                </View>
                <View>
                    <MultiPurposeWidgetLine 
                        icons={IconJS} 
                        isPressable = {false}
                        iconSize={25}
                        onPress = {handlePress} 
                        onLongPress ={handlePress}
                        iconColor = {textColor} 
                        iconBgColor = {iconColor}
                        //iconGroupWrapperStyle = {{flex}}
                        isShadow = {false}
                    />
                </View>
        </Pressable>
    )
}

