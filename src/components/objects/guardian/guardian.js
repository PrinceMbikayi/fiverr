import React from 'react';
import { View,Text,Image,Pressable } from 'react-native';
import {useState} from 'react';
import styled from 'styled-components/native';
import { useTheme } from '_theming/themeProvider';
import {WidgetIconRoundWrapper} from '@components/ui/buttons/widgetIconRoundWrapper';



export const TypeGuardian = (props) => {
   
  
    const {uObject} = props;
    const { statuses,execute} = uObject;

    const {theme} = useTheme();
    const iconSize = 48;
  
    const iconColor = theme['card--color--icon'];  
    const tintColor = theme["widget--round--wrapper--color--border"] // transparent or Green 

    const actionOn = (channel) => {       
        /* Be careful status first letter is lowercase */
        const actionName = 'OPEN'+' '+'S'+channel;
        //console.log(itemId,actionName)
        execute(actionName);
    }

   const ObjectChannelUi = (props) => {

        const {image,actionId} = props
        const downColor ="#CCCCCC";
        const upColor ="transparent";
        const [isDown,setIsDown] = useState(false);
        const onPressIn = () => {setIsDown(true);};
        const onPressOut = () => {setIsDown(false);};
        return (
            <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                <WidgetIconRoundWrapper iconSize={iconSize} checkOn={statuses['s'+actionId]}>
                        <Pressable  style={{borderRadius:iconSize*1.6/2,backgroundColor:(isDown)?downColor:upColor}} onPress={()=>{actionOn(actionId)}}  onPressIn={onPressIn} onPressOut={onPressOut}>       
                            <Image source={image} style={{height:iconSize,width:iconSize,... (statuses['s'+actionId] == "on")? { 'tintColor': tintColor } : {'tintColor':iconColor}}}/>
                        </Pressable>   
                </WidgetIconRoundWrapper>
            </View>
        )
   }
    
    return (
            <StyledMainView style={{flexDirection:'row'}}> 
                <ObjectChannelUi actionId={1} image={require("_images/guardian/voiture.png")}/> 
                <Separator vMargin={(iconSize / 2)}  />
                <ObjectChannelUi actionId={2} image={require("_images/guardian/pieton.png")}/>                        
            </StyledMainView>
    )
}

const StyledMainView = styled.View`
                    flex: 1;
                    min-height:150px;                   
                `;
const Separator = styled.View`
            width: 1px;
            background-color:#999999;
            margin-top:${props => props.vMargin || 0 }px;
            margin-bottom:${props => props.vMargin || 0 }px;                
`;