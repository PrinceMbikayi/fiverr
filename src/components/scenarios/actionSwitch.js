import React from 'react';
import { View,Switch,Text,} from 'react-native';
import styled from 'styled-components/native';

import { useTheme } from '_theming/themeProvider';

export const ActionSwitch = (props) => {

        
        const {actionText,callback,stateName,stateValue } = props; 
        const {theme} = useTheme();
        const textColor = theme["schedule_widget_text_color"];
       

        return (

            <View style={{flex:1,flexDirection:'row',marginTop:10,minHeight:40,alignItems:'center'}}>
            <View style={{flex:2}}>
                <SwitchText color={textColor}>{actionText}</SwitchText>
            </View>
            <View style={{height:'100%',minWidth:80,width:80,height:30,alignItems:'flex-end'}}>
                {!props.hideToggle &&
                    <Switch
                            trackColor={{ false: theme.dark_body_darker, true: theme.primary }}
                            thumbColor={stateValue ? theme.onPrimary : theme.onPrimary}
                            ios_backgroundColor={theme.dark_body_darker}                                  
                            onChange={() => {callback(stateName)}}
                            value={stateValue}
                    />
                }
            </View>
            
        </View>
        )
}

//-----------------------
const SwitchText = styled.Text`
       color: ${props => props.color}; 
        font-size:20px;         
    `;