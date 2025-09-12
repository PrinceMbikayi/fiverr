import React,{useState} from 'react';
import { View,Text,StyleSheet,TouchableOpacity,Pressable} from 'react-native';


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

    const disabledColor = theme["card--color--disabled"] || "#777777";
    const hPadding =props.hPadding || 25;
    const buttonColor = specialColor || theme["screen--color--text"] || "yellow";
    const buttonDefaultStyle = {borderColor:buttonColor,backgroundColor:'transparent',borderWidth:2,padding:10,margin:10,alignItems:'center',minHeight:24};
    const buttonStyle = (props.buttonStyle) ? [buttonDefaultStyle,props.buttonStyle] : buttonDefaultStyle;
    const buttonDisabled = {borderColor:disabledColor}
    const titleDefaultStyle = {color:buttonColor,textTransform:'uppercase',minHeight:16};
    const titleStyle = (props.titleStyle) ? [titleDefaultStyle,props.titleStyle] : titleDefaultStyle;
    const titleDisabled = [titleStyle,{color:disabledColor}]
    const buttonPressed = {backgroundColor:'white',borderColor:'red'};
    const titlePressed = {color:'red'};
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
        <View style={[horizontalPadding ? {paddingLeft: horizontalPadding,paddingRight:horizontalPadding }:{},]}>
            <Pressable  disabled={props.disabled || false} activeOpacity={1} underlayColor={'#FF000001'} onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut} onShowUnderlay={()=>_showUnderLay()} onHideUnderlay={_hideUnderLay} {...testAppium}>
                <View style={[!isDown ? (!props.disabled ? [buttonStyle] : [buttonStyle,buttonDisabled]): [buttonStyle,buttonPressed],isCentered ? {alignSelf: 'center',paddingLeft: hPadding,paddingRight:hPadding}:{},{flexDirection:"row",justifyContent:"center"}]}>
                    {icon && 
                        <View style={{width:16,height:16,marginRight:8}}>{icon}</View>
                    }
                   
                    <Text style={[!isDown ?  (!props.disabled ? [titleStyle,{backgroundColor:'transparent'}] :[titleDisabled] ): [titleStyle,titlePressed],isCentered ? {alignSelf: 'center'}:{}]}>{props.title}</Text>
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