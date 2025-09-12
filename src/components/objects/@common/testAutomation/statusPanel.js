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



export const StatusPanel= (props) => {
   
    console.log("react-native-config : StatusPanel",props,Config)

    const { t, i18n } = useTranslation();
    const { itemId,typeName,autoTestId} = props;   
    const {theme} = useTheme();    
    const itemDatas = useSelector(state => getObjectById(state,itemId));
    console.log("--->>",itemDatas.typeName)
    const referenceItemDatas  = useSelector(state => getWidgetReference(state,itemId)); 
    

    const getStatus = (statusName) => {
        return referenceItemDatas?.statusDictionary?.[statusName]
    }

    const getItemProp = (propName) => {
        return referenceItemDatas?.[propName]
    }

   //---------------------------------------------------------------------
   // == EFFECTS ==
  
   useEffect(() => {  
    console.log("referenceItemDatas?.statusDictionary",referenceItemDatas?.statusDictionary) 
   
}, [referenceItemDatas?.statusDictionary]);




   const RenderItem = (props) => {

       return (
        <View>

        </View>

       )

   }

    const [statusNames,setStatusNames] = useState([])
    useEffect(() => {  
        setStatusNames(Object.keys(itemDatas?.statusDictionary))
       

    }, [referenceItemDatas?.statusDictionary?.status]);
    
    const testAutomated = Config?.TEST_AUTOMATION
    const [open,setOpen] = useState(false)
    const toggleMe = () => {
        console.log("toggleMe")
        setOpen(!open);
    }



    return (
            <>
                { (testAutomated) && 
                    <PanelView isOpen={open}>
                        {/*<View style={{position:'absolute',right:0,top:5}}  zIndex={4}>
                            <Icon name="chevron-right" size={20} color={"black"} onPress={() => {console.log("ouh");toggleMe();}} containerStyle={{backgroundColor:"yellow"}}/>
                </View>*/}
                        {statusNames.map((keyName,i) => {
                                return (
                                    <View style={{flexDirection:'row'}}>
                                        <StatusText>{keyName}</StatusText>
                                        <StatusText> : </StatusText>
                                        <StatusText  accessibilityLabel={props?.autoTestId+'_'+keyName}>{referenceItemDatas?.statusDictionary?.[keyName]?.toString()}</StatusText>
                                    </View>

                                )
                            
                            })
                        }
                        {/*
                        <View style={{flexDirection:'row'}}>
                            <Text>{props?.automatedTestId+'_status'} : </Text><Text  accessibilityLabel={props?.automatedTestId+'_status'}>{checkOnState}</Text>
                         </View>
                        */}
                     </PanelView> 
                }
            </>
             
    )
}

const StatusText = styled.Text`
                    color:white;
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

