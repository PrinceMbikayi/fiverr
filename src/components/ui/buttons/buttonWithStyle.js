import React from 'react';
import {TouchableHighlight,Text,View} from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '_theming/themeProvider';


export const ButtonWithStyle = ({icon = null,title,titleStyle={},buttonStyle={},containerStyle = {},onPress,buttonTestID = {}}) => {
   
    const {theme} = useTheme();
    const iconSize = 0;
    const onAction = () => {
        onPress();
    }
    
    
    return  (
            <View style={containerStyle}>
                <TouchableHighlight activeOpacity={0.3} underlayColor="#DDDDDD" style={{...buttonStyle,borderRadius:iconSize}} onPress={()=>{onAction()}} {...buttonTestID}>                       
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                    {icon}
                    <Text style={{...titleStyle,padding:10,textAlign:'center'}}>{title}</Text>
                    </View>
                </TouchableHighlight>
            </View>             
           
    );
}

//-------------- styles and styled ------------------------

const Caption = styled.Text`
                   font-size:12px;
                   margin-top:8px;
                `;
