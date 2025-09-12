import React from 'react';
import { View,Text,TouchableHighlight} from 'react-native';
import { MaterialIcon } from '../icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '_theming/themeProvider';


import PropTypes from 'prop-types';

const areEqual = (prevProps, nextProps) => {
  
    const noReRender = (prevProps.callback === nextProps.callback)
    return noReRender;
    // no render -> return true;
}

export const ButtonInList = React.memo(props => {
    const { t, i18n } = useTranslation();
    const { navigation,title,subtitle,icon} = props;   
    const myIcon = (icon) ? icon:'add';
    const {theme} = useTheme();
    const  myColor = props.color || theme.body_color_text
    return (
        <TouchableHighlight onPress={props.callback}>
            <View style={[styles.wrapper]}>
                <View style={styles.titleZone}>
                            <Text style={{color:myColor}}>{title}</Text>
                            {subtitle ? <Text style={[styles.subtitle,{color:myColor}]}>{subtitle}</Text>: null }                            
                    </View>
                    <View style={[styles.addZone,]}>
                            <MaterialIcon name={myIcon} color={myColor} size={20}/>
                    </View>  
            </View>
        </TouchableHighlight>
       

    )
}, areEqual)

//export const ButtonInList = React.memo(ButtonInListFunc);

ButtonInList.propTypes = {
   
    title:PropTypes.string,
    icon:PropTypes.string, 
}



const styles = {
    wrapper : {
        flexDirection:'row',
        marginBottom:10
    },
    titleZone: {
        flexGrow:2,
        justifyContent:'center'
    },
    addZone : {
        width:30,
        justifyContent:'center',
        alignItems:'center',
        
    },
    subtitle: {
        color:'red'
    }
}