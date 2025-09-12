import React from 'react';
import { View,Text,TouchableOpacity} from 'react-native';

import { MaterialIcon } from '_components/ui/icons';
import { useTheme } from '_theming/themeProvider';



const areEqual = (prevProps, nextProps) => {
    // ATTENTION REDRAW   
    const noReRender = (prevProps.callback === nextProps.callback   && prevProps.color == nextProps.color)
    return noReRender;
    // no render -> return true;
}

/**
 * RightChevron with action (memoized)
 * 
 * @param {object} props
 * @param {function} props.callback
 * @param {string} props.color
 * @returns clickable right chevron
 */
const _rightChevron = props => {
    
    const { callback,color} = props;   
    const {theme} = useTheme();
    return (
        <View style={{width:20}}>
            <TouchableOpacity onPress={() => callback()} style={{flexDirection:'row',alignItems:'center'}}>
                <MaterialIcon name="chevron-right" size={30} color={color || "black"}/>
            </TouchableOpacity>
        </View>
       

    )

}
/**
 * @type {_rightChevron}
 */
export const RightChevron = React.memo(_rightChevron, areEqual)
