import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet} from 'react-native';
import { useObject } from '_hooks/object';
import { useTheme} from '_theming/themeProvider'
import { RenderIconByState } from "_brand/templates/components/objects/common/RenderIconByState";



/**
 * This component render a toggle with square view
 * @param {Object} props
 * @param {component} props.IconJS  the name under which your component is imported
 * @param {string} props.iconColor icon component color attribute
 * @param {number}  props.iconSize size of the view encapsutated the icon component
 * @param {string}  props.bgColor background color
 * @param {Function}  props.onPressHandler
 * @param {string} props.title
 * @param {string} props.viewForm 'circle' or flex 'square'
 * @param {string} props.id item id
 */
export const ToggleCard = (props) =>{
    const {
            title, titleColor ,IconJS, iconSize, iconColor, 
            bgColor, onPressHandler, id, setActive, borderColor,
            borderWidth, fontSize, fontWeight,
            levelState, typeName, isPressable
        } = props;
    //const uObject = useObject(id);

    //console.log("SET ACTIVE :", setActive)

    const {theme } = useTheme();

    //const borderColor = theme?.prflxBorderColor||'orange';
    const Containerbgcolor = theme?.prflxContaintBgColor||'white';
    const bgcolor = theme?.prflxbgColor||'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor||"white";
    //const textColor = theme?.prflxTextColor||'black'
    const headerBgColor = theme?.prflxHeaderBackground || '#FFFFFF'

    const handlePress = ()=>{
        //console.log("INTER ID :", id)
        onPressHandler(id);
       // onPressHandler(id, uObject);
    }

    // useEffect(() => {        
    //     console.log("CHECK AVTIVE TOGGLE :", setActive)
    //   }, [setActive]);

            return(
                    <Pressable 
                        disabled={!isPressable||false}
                        onPress={handlePress} 
                        style={{
                            justifyContent:'center',
                            alignItems:'center', 
                            flexWrap:'nowrap',
                            flexDirection:'column', 
                            backgroundColor: bgColor,                                
                            borderColor:borderColor, 
                            borderWidth: borderWidth,
                            borderRadius:12,
                            shadowOffset:{width: 0, height: 4},
                            shadowOpacity: 0.5,
                            elevation:8,
                            shadowColor:'#4d4d4d',
                            }}
                        >
                                <View style={{flexWrap:'nowrap', justifyContent:'space-around', alignItems:'center', width:78, height:100, margin:2,padding:5}}>
                                    <Text numberOfLines={2} ellipsizeMode='tail' style={{color:titleColor, fontSize:fontSize, textAlign:'center', fontWeight:fontWeight}}>
                                        {title}
                                    </Text>
                                    {/* <RenderIconByState levelState={levelState} typeName={typeName} iconColor={iconColor} iconSize={iconSize}/> */}
                                    <View style={{width:iconSize, height:iconSize, alignItems:'center', justifyContent:'space-evenly'}}>
                                        <IconJS color = {iconColor} />
                                    </View>
                                </View>
                    </Pressable>
            )
}

const styles = StyleSheet.create({
    
})