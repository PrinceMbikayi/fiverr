import React from 'react';
import {useEffect,useState,useRef} from 'react';
import { View,Text,TouchableHighlight } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';

import {updateStatus,updateGroupStatus} from '_actions/objects';
import { useTheme } from '_theming/themeProvider';
import PureIconRender from '_components/pureIconRender';
import {domusIcons} from '_assets/icons/domusIcons';
import {WidgetIconRoundWrapper} from '@components/ui/buttons/widgetIconRoundWrapper';


import {getObjectById,getWidgetReference} from '_helpers/selectors';
import { IconButton} from '@components/ui/buttons/iconButton';



import Config from "react-native-config";



export const AutomatedTestIdDisplay= (props) => {
   
    // ATTENTION console.log("react-native-config : StatusPanel",props,Config);  
    const { itemId,typeName,autoTestId} = props;   
    const {theme} = useTheme();    
   
    

   //---------------------------------------------------------------------
   // == EFFECTS ==
  


    
    const testAutomated = Config?.TEST_AUTOMATION
    


    return (
            <>
                { (testAutomated) && 
                    <>
                    <AutomatedIdText>{autoTestId}</AutomatedIdText>
                    </>
                }
            </>
             
    )
}

const AutomatedIdText = styled.Text`
                    color:black;
                    background-color:yellow;
                `;
            

const PanelView = styled.View`
                    flex: 1; 
                  
                    background-color:#00000099;
                `;

const PanelViewFloat = styled.View`
                    flex: 1; 
                    position:absolute;
                    height:100%;
                    width:100%;
                    left:-100%;
                    margin-left:20px;
                    min-height:150px;
                    ${({isOpen}) => isOpen  && `
                       left: 0;
                       margin-left:0px;
                    `}
                    background-color:#00000099;
                `;

