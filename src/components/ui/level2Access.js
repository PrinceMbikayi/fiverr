import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableHighlight, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { useTheme } from '_theming/themeProvider';




export const Level2Access = React.memo(props => {
   
    const { itemId,callback} = props;
   // WARNING CHECK HERE console.log("Level2Access > ",props)
   
    const {theme} = useTheme();
    const { t, i18n } = useTranslation();
    const textColor = theme["card--color--text"];

    const doCallback = () => {
        if(props.callback != undefined) {
            props.callback(props.itemId)
        } else {
            console.warn("no callback")
        }
    }

    const VisibleMoreLink = () => {
        return (
            <View>
                <TouchableHighlight onPress={doCallback} style={{alignItems:'center'}} activeOpacity={0.6}
                    underlayColor="#DDDDDD">
                    <>
                        <Text style={{color:textColor}}>{t("MORE")}</Text>
                        <Icon name="expand-more" size={30} color="#777777" style={{marginTop:-10}}/>  
                    </>                                
                </TouchableHighlight>
            </View>
        )
    }

    const MoreLink = () => {
        return (props.hideMoreLink) ? <></> : <VisibleMoreLink/>
    }
                                

    return (
       <MoreLink/>
    )
});
