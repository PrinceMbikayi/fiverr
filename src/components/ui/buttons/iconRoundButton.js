import React from 'react';
import {TouchableHighlight} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';

import PureIconRender from '_components/pureIconRender';

const areEqual = (prevProps, nextProps) => {
    
    const noReRender = (prevProps.iconColor === nextProps.iconColor)
    return noReRender;
    // no render -> return true;
}

export const IconRoundButton = React.memo(props => {
   
    const {touchSize,iconSize,iconName,iconColor,callback,appIcon,iconComponent = null} = props;
    console.log("IconRoundButton",props)  

    const doCallback = () => {
        if(callback)callback();
    }
    // exemple simple dynamic Component
   const Deuz = () => {
        const RenderIcon = iconComponent;
        return <RenderIcon color={iconColor}/>
   
   }
   
    return (
        <TouchableHighlight
                        activeOpacity={0.6}
                        style={{height:iconSize,width:iconSize,borderRadius:iconSize}}
                        underlayColor="#DDDDDD"
                        onPress={() => doCallback()}>
                            <>
                            {(!appIcon && !iconComponent) && 
                                <Icon name={iconName} size={iconSize} color={"iconColor"} style={{alignSelf:'center'}}/>
                            }
                            {(appIcon && !iconComponent) && 
                                <PureIconRender size={iconSize} img={iconName} appIcon fill={iconColor}/>                 
                            }
                            {iconComponent &&
                              <Deuz/>
                            }
                            </>
        </TouchableHighlight>
    )
}, areEqual)

//export const ButtonInList = React.memo(ButtonInListFunc);

IconRoundButton.propTypes = {
   
    touchSize:PropTypes.number,
    iconSize:PropTypes.number,
    callback:PropTypes.func,
    iconName:PropTypes.string,
    iconColor:PropTypes.string
  }
