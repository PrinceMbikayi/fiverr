import React,{useState} from 'react';
import { View,Text,StyleSheet,Pressable} from 'react-native';


import { useTheme } from '_theming/themeProvider';

/**
 * Acces Button
 * @param {object} props 
 * @param {string} props.title button label
 * @param {function} props.onPress a callback
 * @param {string} [props.specialColor] a color
 * @param {object} [props.buttonStyle] style properties applied on container
 * @param {boolean} [props.disabled]
 *
 */
const AccessButton = (props) => {   

    const {specialColor,isCentered,horizontalPadding,testAppium,icon = null} = props;   
    const {theme} = useTheme();

    const borderColor = theme?.prflxBorderColor||'orange';
    const Containerbgcolor = theme?.prflxContaintBgColor||'white';
    const bgcolor = theme?.prflxbgColor||'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor||"white";
    const textColor = theme?.prflxTextColor||'black'
    const headerBgColor = theme?.prflxHeaderBackground || '#FFFFFF'

    const disabledColor = textColor || "#777777";
    const hPadding =props.hPadding || 25;
    const buttonColor = textColor;
    const buttonDefaultStyle = {borderColor:textColor,backgroundColor:textColor,borderWidth:2,padding:10,margin:10,alignItems:'center',minHeight:24};
    const buttonStyle = (props.buttonStyle) ? [buttonDefaultStyle,props.buttonStyle] : buttonDefaultStyle;
    const buttonDisabled = {borderColor:disabledColor, backgroundColor:'green'}
    const titleDefaultStyle = {color:textColor,textTransform:'uppercase',minHeight:16};
    const titleStyle = (props.titleStyle) ? [props.titleStyle] : titleDefaultStyle;
    //const titleStyle = (props.titleStyle) ? [titleDefaultStyle,props.titleStyle] : titleDefaultStyle;
    const titleDisabled = [titleStyle,{color:disabledColor}]
    const buttonPressed = {backgroundColor:'white',borderColor:'red'};
    const titlePressed = {color:textColor};
    const [isDown,setIsDown] = useState(false)

    const onPress = () => {
       
        props.onPress()
    }

    const onPressIn = () => {
        setIsDown(true)
    }

    const onPressOut = () => {
        setIsDown(false)
    }
    const _showUnderLay = () => {
       
        setIsDown(true)
    }
    const _hideUnderLay = () => {
        setIsDown(false)
    }

    return (
        <View >
            <Pressable  disabled={props.disabled || false} activeOpacity={1} underlayColor={'#FF000001'} onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut} onShowUnderlay={()=>_showUnderLay()} onHideUnderlay={_hideUnderLay} {...testAppium}>
                <View style={[{}, !isDown ? (!props.disabled ? [buttonStyle,{backgroundColor:textColor, marginBottom:10}] : [buttonStyle,buttonDisabled]): [buttonStyle,buttonPressed],isCentered ? {alignSelf: 'center',paddingLeft: hPadding,paddingRight:hPadding}:{},{flexDirection:"row",justifyContent:"center"}]}>
                    {icon && 
                        <View style={{width:16,height:16,marginRight:8, backgroundColor:'transparent'}}>
                            {icon}
                        </View>
                    }
                    <Text style={[!isDown ?  (!props.disabled ? [titleStyle,{backgroundColor:'transparent', color:'white', fontSize:17, fontWeight:'600'}] :[titleDisabled] ): [titleStyle,titlePressed],isCentered ? {alignSelf: 'center'}:{}]}>{props.title}</Text>
                   
                </View>            
            </Pressable>
        </View>
    )   
    

}


export default AccessButton;


const styles = StyleSheet.create({
    insideBlock: {
      margin:10
     
    },
    buttonContainer: {
        width:'100%',
        marginTop:10,
        
    }
  });