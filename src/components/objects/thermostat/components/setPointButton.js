import React from 'react';
import { View,TouchableHighlight} from 'react-native';

/**
 * SetPointButton in Thermostat 
 * 
 * @param {Object} props
 * @param {any} props.children it's a wrapper !!
 * @param {function} props.callback
 * @param {'decrease' | 'increase'} props.way
 * @param {'Left' | 'Right'} props.align
 * @param {string} props.point the id of the T° to set
 * @param {number} [props.iconSize]
 * 
 */
export const SetPointButton = (props) => {

    const {callback,point,way,iconSize,align,children} = props;

    const doAction = () => {
        callback(point,way)
    }
  
    let dynStyle = {}
    if(align) {
        dynStyle['borderTop'+props.align+'Radius'] = iconSize*1.05/2;
        dynStyle['borderBottom'+props.align+'Radius'] = iconSize*1.05/2;        
    }
   
    return (
        <View style={[dynStyle,props.style]}>           
            <TouchableHighlight onPress={() => doAction()} activeOpacity={0} underlayColor="transprent">
            {
                children
            }
            </TouchableHighlight>            
        </View>
    )
}