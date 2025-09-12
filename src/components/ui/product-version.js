import React from 'react';
import { View,Text,TouchableHighlight} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { withTheme } from '_theming/themeProvider';


export const ProductVersion = React.memo(props => {

    const {label} = props;
    console.log("firmaware ("+label+")");
    const color = props.color || "black"
    const lineColor = props.lineColor || props.color || "black"
   
    return (
        <View style={{flexDirection: 'row',padding:15, ...(label == "" || label == undefined) ? { opacity:0 } : {} }}>
            <View style={{backgroundColor: lineColor, height: 2, flex: 1, alignSelf: 'center'}} />
            <Text style={{ alignSelf:'center', paddingHorizontal:10, fontSize: 16,color:color }}>version : {label}</Text>
            <View style={{backgroundColor: lineColor, height: 2, flex: 1, alignSelf: 'center'}} />
        </View>
    )

});