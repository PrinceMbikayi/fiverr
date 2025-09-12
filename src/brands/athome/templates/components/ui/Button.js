import React from 'react';
import {Pressable,Text} from 'react-native'
const Button = (props) => {
    const {title,titleColor = "black",bgColor= "green",onPress, disabled, onTouch} = props
    return ( 
        <Pressable onPress={onPress} onPressIn={onTouch} disabled={disabled} style={[containerStyle,{backgroundColor:bgColor}]} activeOpacity={1}
        underlayColor="#FFF8EB">
            <Text style={[textStyle,{color:titleColor}]}>{title}</Text>
        </Pressable>
     );
}
 
export default Button;

const containerStyle = {height:44,borderRadius:16,alignItems:'center',justifyContent:'center'};
const textStyle = {fontSize:14,fontWeight:'bold'}