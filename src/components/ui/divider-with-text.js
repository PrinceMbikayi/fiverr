import React from 'react';
import { View,Text} from 'react-native';


export const DividerText = React.memo(props => {

    const {label} = props;
    const color = props.color || "black"
    const lineColor = props.lineColor || props.color || "black"
   
    return (
        <View style={{flexDirection: 'row'}}>
            <View style={{backgroundColor: lineColor, height: 2, flex: 1, alignSelf: 'center'}} />
            <Text style={{ alignSelf:'center', paddingHorizontal:10, fontSize: 16,color:color }}>{label}</Text>
            <View style={{backgroundColor: lineColor, height: 2, flex: 1, alignSelf: 'center'}} />
        </View>
    )
});