import React, {Fragment,useEffect,useState} from 'react';
import { Text,View,Switch,Pressable} from 'react-native'; // use in styled components
import CheckBox from '@react-native-community/checkbox';
import styled from 'styled-components/native';

import { useTheme } from '_theming/themeProvider';
import {RightChevron} from '_components/ui/rightChevron';
import {IconButton} from './iconButton';
import PureIconRender from '_components/pureIconRender';


/**
 * return a useful multiline component
 * @param {Object} props
 * @param {number} props.id will be passed to callback
 * @param {string} props.title
 * @param {function} props.callback
 * @param {string} [props.value] mandatory if actionType = switch
 * @param {"navigate"|"switch"|"browse"|"select"} props.actionType
 * @param {string} [props.color] overide theme color
 * @param {string} [props.bottomLineColor] defaut text color
 * @param {string} [props.icon] - icon on Left side
 * @param {number} [props.iconSize=36] default = 36
 * @param {boolean} [props.active]
 * @param {boolean} [props.fullTouchable]
 * @param {boolean} [props.noBottomLine]
 * @param {boolean} [props.subtitleAppart]
 * 
 */
export const MultiPurposeLine = (props) => {
   
   
    const { theme} = useTheme();

    const { id,icon,iconSize= 32,
            title,subTitle,
            containerStyle = {},
            titleIcon,titleIconComponent = null,titleIconSize = 16,
            titleStyle,subtitleStyle,subtitleAppart,
            actionType,
            displayText,
            callback,
            value : switchValue,
            active,
            fullTouchable,enlarge,
            longPress,longPressData,selected, subTitleOpacity = 1,
            switchActiveColor = theme.primary,
            iconLeft = null,
            selectedBgColor,
            delayLongPressDuration = 3,
            color = theme.onBody,
            noBottomLine,
            bottomLineColor,
            rightIcon = null
          
        } = props;
    

    const [icons,setIcons] = useState([]);
    const [isActive,setIsActive] = useState(false)
  
    const doCallback = () => {  
          
        (callback || Function)(id)       
    }

    const doFullCallback = () => {
        console.log("doFullCallback")   
        if(fullTouchable)doCallback()
    }

    const switchCallback = () => {       
        if(callback)callback(id,!switchValue)
    }

    const doLongPress = () => {  
        console.log(Date.now());     
            (longPress || Function)(longPressData);             
    }  

   
    
    useEffect(() => {
       // Charger les icons depuis notre systeme de rangement des icons 
        const icons = icon?.split(",") || [];      
        const ret = icons.reduce((r,v,i) => {           
            const iconName = (v?.indexOf('.svg') != -1) ? v : v+'.svg';
            r.push(iconName)
            return r;
        },[])       
        setIcons(ret)
    }, [icon]);

    useEffect(() => {
        setIsActive(active);
    }, [active]);

    useEffect(()=> {
      //
    },[selected])
    

    //--------------------------------------------------    

   
    const activeOpacityValue = 0.6
    const underlayColorValue = "#DDDDDD";
    const bodyTextColor = color || theme['add_product_list_name_color'] || theme["onBody"];
    const selectedWrapperColor = selectedBgColor || theme["multipurposeline-selected-background"] || "transparent";


    //--------------------------------------------------
    const startPress = () => {
        console.log("delayLongPressDuration",delayLongPressDuration)
        console.log(Date.now())
    }

    
    const testDuration = delayLongPressDuration*1000;


    const doCallbackWithId = () => {
        callback(id)
    }



    return (
        <Pressable onPress={doFullCallback} onPressOut={(e) => {console.log("EEEEEEEEEEEE");e.stopPropagation()}} onPressIn={()=>startPress()} delayLongPress={testDuration} onLongPress={()=> doLongPress()}  
                    disabled={(fullTouchable !== true && longPress == undefined)} 
                    activeOpacity={activeOpacityValue}
                    underlayColor={underlayColorValue}
                    
                    style={{...containerStyle}}>
            <>
            <Wrapper color={color}  enlarge={enlarge}  { ...( selected && {bgColor:'green' || selectedWrapperColor})}>
                {icons.length > 0 &&
                     <View style={{width:iconSize+4 ,height:iconSize+4,alignItems:'center',justifyContent:'center',marginRight:4}}>
                    { icons.map((v,i)=> {
                            return (
                                <Fragment  key={"fgicons_"+i}>
                                    {(v!= undefined && 1 == 1) &&
                                    <View style={{position:'absolute'}}>
                                        <PureIconRender img={v} appIcon={true} size={iconSize} fill={color}/>
                                    </View>                                   
                                    }
                                </Fragment>
                            )
                        })
                    }     
                    </View>                    
                }
                {
                    iconLeft 
                }
                <TextContainer>
                    <>
                    <View style={{flexDirection:'row'}}>
                        {titleIcon && 
                            <PureIconRender img={titleIcon} appIcon={true} size={titleIconSize} fill={color}/>
                        }                       
                        <View>
                            <View style={{flexDirection:'row',flex:1,alignItems:'center'}}>
                                {titleIconComponent &&
                                    <View style={{width:titleIconSize,height:titleIconSize}}>
                                        {titleIconComponent}
                                    </View>
                                }
                                <Title color={color} active={isActive} style={titleStyle}>{title}</Title>
                            </View>
                           
                            {(subTitle  && !subtitleAppart) &&
                                <View style={{flexDirection:'row',flex:1,alignItems:'center'}}>
                                {titleIconComponent &&
                                    <View style={{opacity:0,width:titleIconSize,height:titleIconSize}}>
                                        {titleIconComponent}
                                    </View>
                                }
                                 <Title color={color} active={isActive} style={subtitleStyle}>{subTitle}</Title>
                               </View>                               
                            }                            
                        </View> 
                    </View>                  
                    </>
                </TextContainer>
                <View style={{backgroundColor:'transparent',minWidth:30,flexDirection:'row'}}>
                    <>
                    {(actionType && actionType == "navigate") &&
                            <NavigationBlock style={{backgroundColor:'transparent'}}>
                                <RightChevron callback={doCallback} color={color}/>
                            </NavigationBlock>
                    }
                    {(actionType && actionType == "switch") &&
                            <NavigationBlock>
                                <Switch
                                    trackColor={{ false: theme.dark_body_darker, true: switchActiveColor }}
                                    thumbColor={switchValue ? theme.onPrimary : theme.onPrimary}
                                    ios_backgroundColor={theme.dark_body_darker}                                  
                                    onChange={() => {switchCallback()}}
                                    value={switchValue}
                                />
                            </NavigationBlock>
                    }
                    {(actionType && actionType == "browser") &&
                            <NavigationBlock style={{width:40}}>
                                <IconButton callback={doCallback} action="hop" icon="external-link" />
                            </NavigationBlock>
                    }
                    {(actionType && actionType == "select") &&
                            <NavigationBlock style={{width:40}}>
                                <CheckBox
                                    disabled={false}
                                    value={value}
                                    onValueChange={doCallback}
                                    onTintColor={color} onCheckColor={color} 
                                    tintColors={{true:color,false:color}}
                                />  
                            </NavigationBlock>
                    }
                     {(displayText) &&
                            <NavigationBlock style={{minWidth:40}}>
                               <Pressable onPress={doCallbackWithId} disabled={callback == undefined}>
                                    <Text style={{textAlign:'right',fontSize:16,paddingRight:8}}>{displayText}</Text>
                                </Pressable>
                            </NavigationBlock>
                    }
                    {
                        rightIcon
                    }
                </>
                </View>
              </Wrapper>
              {(subTitle  && subtitleAppart) &&
                <View style={{marginBottom:16,marginTop:-12,paddingRight:40,flexDirection:'row'}}>
                     {titleIconComponent &&
                                    <View style={{opacity:0,width:titleIconSize,height:titleIconSize}}>
                                        {titleIconComponent}
                                    </View>
                                }
                        <Title color={color} active={isActive} style={subtitleStyle}>{subTitle}</Title>
                </View>
                }
              <BottomLine color={noBottomLine ? 'transparent' : bottomLineColor || color}  enlarge={enlarge}/>
              </>     
              </Pressable>           
        )
}

const Wrapper = styled.View`
                flex-direction:row;               
                align-items:center; 
                border-bottom-color:${props => props.color || 'yellow'};
                background-color:${props => props.bgColor || 'transparent'};
                border-bottom-width:0px;               
                padding-Left:${props => props.enlarge || 0}px; 
                padding-right:${props => props.enlarge || 0}px;         
            `;
// condition styled example
const BottomLine = styled.View`
                
                height:1px;
                border-bottom-width:1px; 
                border-bottom-color:${props => props.color || 'yellow'};              
                margin-Left:${props => props.enlarge || 0}px; 
                margin-right:${props => props.enlarge || 0}px;         
            `;

const TextContainer = styled.View`
    flex-grow:4;
    flex:1;
    background-color:transparent;
    padding-top:20px;
    padding-bottom:20px;
    overflow:hidden;
`;

const Title = styled.Text`
                color:${props => props.color || 'yellow'};
                padding-left:10px;
                padding-right:10px;               
                ${({active}) => active  && `
                    font-weight: bold;
                `};
               
                flex-wrap: wrap; 
                min-height:20px;
            `;
const SubTitle = styled.Text`
    color:${props => props.color || 'yellow'};
    padding-left:10px;
    padding-right:10px;               
   

flex-wrap: wrap;
`;
const NavigationBlock = styled.View`   
    min-width:30px;    
`;
