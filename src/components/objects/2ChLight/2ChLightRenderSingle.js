import React from 'react';
import {useEffect,useRef,useState} from 'react';
import { Pressable } from 'react-native';


import { useTheme } from '_theming/themeProvider';
import PureIconRender from '_components/pureIconRender';
import {WidgetIconRoundWrapper} from '@components/ui/buttons/widgetIconRoundWrapper';

import PropTypes from 'prop-types';


/**
 *  OK test JSDOC
 * @category COMPONENTS
 * @subcategory 2CHLIGHT
 * @module TwoChLightRenderSingle
 * 
*/
const TwoChLightRenderSingle = (props) => {   
   
    const { channel,callback,status,activeStatusesImages,icon} = props;   
    const {theme,baseColors} = useTheme();
    const {cardIconColor} = baseColors;

    
    const iconSize = 48;   
    const iconFillColor = cardIconColor;
    const iconFillColorOn = theme["widget--round--wrapper--color--border"] || "black";   
    
    const colorRef = useRef({color:iconFillColor}); 
    const downColor = "#CCCCCC";
    const upColor  = "transparent";

    const [isDown, setIsDown] = useState(false);

    const onPressIn = () => {
        setIsDown(true)
    }
    const onPressOut = () => {
        setIsDown(false)
    }

    useEffect(() => {   
        
        colorRef.current.color = (status == 'on') ? iconFillColorOn : iconFillColor;
       
    }, [status]);

    const onOffAction = () => {
        callback(channel);
    }

    return (           
            <WidgetIconRoundWrapper iconSize={iconSize} checkOn={status}>
                 <Pressable activeOpacity={0.3} underlayColor="#DDDDDD" style={{borderRadius:iconSize*1.6/2,backgroundColor:isDown ? downColor : upColor}} onPress={onOffAction} onPressIn={onPressIn} onPressOut={onPressOut}>                       
                    <PureIconRender size={iconSize} img={"AtHomeLight"} fill={colorRef.current.color} activeStatusesImages={activeStatusesImages} checkOn={status}/> 
                </Pressable>     
            </WidgetIconRoundWrapper> 
    )
}

TwoChLightRenderSingle.propTypes = {
   
    /*icon:PropTypes.string.isRequired*/
  };


export default TwoChLightRenderSingle 

