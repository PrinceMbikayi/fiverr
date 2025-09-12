import React from 'react';
import { View,Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';


/**
 * iconSize,borderSize,checkOn,backgroundColor,borderColorOn,borderWidth
 * @param {Object} props 
 * 
 * @param {any} props.children the JSX Object inside this wrapper
 * @param {boolean} props.connected
 * 
 */
export const WidgetWrapperInDetails = (props) => {
    const { t, i18n } = useTranslation();
   
    const {connected,children} = props;
    return (
                
                <View style={{flex:1,maxHeight:200,minHeight:200}}>
                    
                    {children}
                    {connected == false  &&
                    <>            
                        <DisconnectedViewOverlay/>
                        <DisconnectedText>{t("OBJECT_DISCONNECTED")}</DisconnectedText>
                    </>
                    }
                </View> 
                
    )
}

const DisconnectedViewOverlay = styled.View`
          position:absolute;
          width:100%;
          height:100%;
          background-color:rgba(238,238,238,0.8)
`;
const DisconnectedText = styled.Text`
          
          font-size:12px;
          font-size:14px;
          padding:4px;
          margin-top:4px;
          margin-bottom:4px;
          color:#999;
          text-align:center;
    
`;