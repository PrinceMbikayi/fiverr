import React from 'react';
import {View,Text,TouchableHighlight} from 'react-native';
import { useTheme } from '_theming/themeProvider';

/**
 * callback,value,range,isEnd,index
 * @param {*} props 
 */
export const LineContent = (props) => {

    const {theme} = useTheme();
    const {label,value,range,isEnd,index} = props;
    const textColor = theme['card--color--text'] || 'green';

    const _callback = () => {
        if(props.callback)props.callback({'value':value,'range':range,'isEnd':isEnd,'index':index})
    }

    return (
        <>
            <TouchableHighlight onPress={_callback} style={{height:32}} underlayColor="#DDDDDD">
                <View style={{flex:1,flexDirection:'row',alignItems:'center',paddingLeft:15}}> 
                    <Text style={{color:textColor,textTransform:'capitalize',width:80}}>{label}</Text>
                    <Text style={{color:textColor}}>{value}</Text> 
                </View>
            </TouchableHighlight>
        </>
    );
}