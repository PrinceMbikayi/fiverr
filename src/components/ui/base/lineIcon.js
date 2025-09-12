import React,{ useState,useCallback ,useEffect} from 'react';
import { View,Text,TouchableHighlight} from 'react-native';

import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';
import {SvgCss} from 'react-native-svg';

import PropTypes from 'prop-types';

import { useTheme } from '_theming/themeProvider';
import {domusIcons} from '_assets/icons/domusIcons';
import {appIcons} from '_assets/icons/appIcons';
import PureIconRender from '_components/pureIconRender';
import {RightChevron} from '_components/ui/rightChevron';


const areEqual = (prevProps, nextProps) => {
    
    //return false;
   // console.log("areEqual LineIcons",prevProps,nextProps);
    const noReRender = (prevProps.text === nextProps.text && prevProps.color === nextProps.color)

  // console.log("noReRender",noReRender);
   return noReRender;
 // no render -> return true;
}


/**
 * @typedef {Object} RefType
 * @property {Object} current
 * @property {() => void} current.methodOne
 * @property {() => void} current.methodTwo
 */

 /**
 * @callback requestCallback
 * @param {number} responseCode
 * @param {string} responseMessage
 */
/**
 * @typedef {Object} Props
 *
 * @property {string} [iconLeft] - using key of icons in assets/icons
 * @property {string} [iconRight] - using key of icons in assets/icons
 * @property {requestCallback} [callback] - a callback if needed
 * @property {Object} [params] - sent back by callback func
 * @property {string} [text] - text to be displayed if the component has no #children
 * @property {number} [iconSize] - has default value
 * @property {string} [color] 
 * @property {bool} [isAppIcon] - just add it if icon is in appIcon
 * @property {bool} [fullTouchable] - if true callback is availaible on the complete line not only the icon
 * 
 */

/**
 * Return memoized LineWithIcon function component (FC)
 * 
 * 
 * @type {React.FC<Props>}
 */
export const LineWithIcon = React.memo(
    
    
    props => {
    const { t, i18n } = useTranslation();
    const { title,iconRight,iconLeft,rightChevron,callback,params,color} = props;
   const iconColor = color;
   // console.log("props",props);
    const {theme} = useTheme();

    useEffect(()=> {
        // refresh on theme change
    },[theme])

    const activeOpacityValue = 0.6
    const underlayColorValue = "#DDDDDD"



    const executeCallback = useCallback(
        () => {
            //console.log("LineIcon => callback",callback,params)
            if(callback != undefined)callback(params)
        },
        [],
      );
    

    /* ok quand unique

    const executeCallback = () => {
       console.log("LineIcon => callback",params)
        if(callback != undefined)callback(params)
    }

    */

    const IconRender = (irProps) => {
        const iconColor = irProps.iconColor || irProps.color || "black";
        const iconSize = irProps.iconSize || 36; 
       
        const iconName = (appIcons[irProps.iconName] || domusIcons[irProps.iconName]) ?  irProps.iconName+'.svg' : "empty"; 
        const isAppIcon = irProps.isAppIcon;
       
        const textColor = irProps.textColor || irProps.color || "black";      
        const callback = irProps.callback;

        let icon = {'img':iconName};
        if (isAppIcon) icon['appIcon'] = true;
        
        if(!isAppIcon) {
            return (
                <TouchableHighlight onPress={executeCallback} activeOpacity={activeOpacityValue} underlayColor={underlayColorValue}>                      
                     <PureIconRender size={iconSize}  fill={iconColor} {...icon} />                
                 </TouchableHighlight>
            )
        } else {
           
            
           return (
               
                    <TouchableHighlight onPress={executeCallback} activeOpacity={activeOpacityValue} underlayColor={underlayColorValue}>                      
                         <SvgCss xml={appIcons[irProps.iconName]} fill={iconColor} width={iconSize} height={iconSize}/>              
                     </TouchableHighlight>
            )
           
        }
       
        <SvgCss xml={appIcons[props.icon]} width="48" height="48" fill={iconColor}/>
    }

    const textStyle = props.textStyle || {};

    return (
        <TouchableHighlight onPress={executeCallback} disabled={(props.fullTouchable !== true)} activeOpacity={activeOpacityValue} underlayColor={underlayColorValue}>
            <ItemRenderContainer  dividerColor={theme.divider_on_body} noBorder={props.noBorder}>
                {iconLeft && 
                    <IconRender iconName={iconLeft} {...props}/>                
                }                
                {
                    props.children ? <ChildrenContainer>{props.children}</ChildrenContainer> :  <ItemText color={color} style={[{textAlign:'left',paddingLeft:10},textStyle]}>{props.text}</ItemText>
                }            
                {iconRight && 
                    <IconRender iconName={iconRight}  {...props}/>                
                }
                {rightChevron &&
                <View style={{marginRight:15}}>
                    <RightChevron color={props.iconColor} callback={executeCallback}/>
                </View>
                    
                }   
            </ItemRenderContainer>
            
        </TouchableHighlight>
    )
}, areEqual)

//export const ButtonInList = React.memo(ButtonInListFunc);


  const ItemRenderContainer = styled.View`
    flex-direction:row;
    border-bottom-width:1px;
    border-bottom-color:${props => props.dividerColor || "white"};
    padding:10px;
    padding-left:5px;
    padding-right:5px;
    align-content:center;
    justify-content:center; 
    ${({ noBorder }) => noBorder && `
       border-bottom-width:0px;
    `}
`;

const ChildrenContainer = styled.View`
     flex:1; 
     justify-content:center;
     padding-left:0px;
     
    
`;
const ItemText = styled.Text`
       
        color: ${props => props.color || "white"}; 
        font-size:14px; 
        flex:1;       
        align-self:center;
`;
