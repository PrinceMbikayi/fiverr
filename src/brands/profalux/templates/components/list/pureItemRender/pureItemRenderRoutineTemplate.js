import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView } from 'react-native';
import styled from 'styled-components/native'
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useObject } from '_hooks/object';
import { useTheme } from '_theming/themeProvider';

import { StyledCardView, StyledInnerCardView, StyledCardGeneralInnerWrapper, StyledSideView} from './styled'

import Chevron from '_brand/images/icons/app/ArrowRight1';
import {iconsJs} from '_brand/utils/iconsJs';
import Setting2 from '_brand/images/icons/app/Setting2';
import { PureItemRenderMenu } from '_components/list/pureItemRender/menu/index.js';

const PureItemRenderRoutineTemplate = (props) => {

  const { itemId, availableCommands, netInfoIsConnected, forceDisplay, typeDynamic, goLevel2, goSettings, listId, modal } = props;
  //automatedTestId exists



 
  const navigation = useNavigation();
  const route = useRoute();
  const navigationParams = route?.params || {};
  const uObject = useObject(itemId);
  const { getId, objectDatas: itemDatas, execute } = uObject;
  if (itemDatas?.flags?.hidden == true) return null;
  const { typeName, connected, statusDictionary: statuses, className } = itemDatas;
  const uniType = uObject?.objectDatas?.uniType



  const { t, i18n } = useTranslation();
  const { theme } = useTheme();

  const widgetbgColor = theme?.prflxwidgetbgColor||'white';
  const textColor = theme?.prflxTextColor||'black'



  useEffect(() => {
  }, []);


  const borderRadius = 10;


  const showInfos = () => {
  }

  const onGoLevel2 = () => {
    goLevel2();
  }


  const getButtons = () => {
    let retVal = [];
    if (uObject.extraConfig?.showConfig == true) retVal.push({ action: goSettings, svgr: <Setting2 color="black" /> })
    if (uObject.extraConfig?.noLevel2 != true) retVal.push({ action: onGoLevel2, svgr: <View style={{ width: 30, height: 30 }}><Chevron color="white" /></View> })
    return retVal;
  }

  const headerButtons = getButtons();

  const objectMenu = () => {
    return (
      <PureItemRenderMenu callbacks={availableCommands} connected={connected} itemDatas={itemDatas} listId={listId} modal={modal} />
    )
  }

  //Harold: "composite" added to list : 04/10/2024 in order to allow Scenario to properly show Groups
  const HALF_WIDGET_TYPE_NAMES =  ['composite', 'LightEzsp', 'SwitchEzsp', 'EzspProbe', 'NetatmoStation', 'NetatmoIndoorProbe','NetatmoOutdoorProbe','NetatmoRainGauge','NetatmoWindGauge']

  return (
    <SafeAreaView >
      <StyledCardView bodyBgColor={widgetbgColor}
      >
      <StyledCardGeneralInnerWrapper heightPercent={100}  bodyBgColor={'transparent'}>

        <DisconnectInnerWrapper 
            heightPercent={100} 
            widthPercent={100} 
            colorTop={(connected == false || !netInfoIsConnected)?
                                                                    theme['card--color--deactivated-overlay']
                                                                 :  'transparent'} 
            style={{zIndex: (connected == false || !netInfoIsConnected)? 2 : 0}}

          />

            <StyledInnerCardView  bodyBgColor='transparent'>
              {typeDynamic}
            </StyledInnerCardView>

          <StyledSideView heightPercent={100} bgColor={'transparent'} style={{zIndex:3}} >
            {typeName != "Associations" &&
              <>
                {( ["Light"].includes(className) || ['LightEzsp', 'SwitchEzsp'].includes(uniType) )?
                  <></>
                  :
                  <Pressable onPress={goLevel2} style={{width: 22,borderRadius:10, height: '100%', opacity:(connected == false || !netInfoIsConnected)? 1:0.5}}>
                    <iconsJs.rightChevronIcon.name color={(connected == false || !netInfoIsConnected)? 'white':textColor} />
                  </Pressable>
                }
              </>
            }

          </StyledSideView>

        </StyledCardGeneralInnerWrapper>

      </StyledCardView>
      
    </SafeAreaView>
  )
}


export default PureItemRenderRoutineTemplate


const styles = StyleSheet.create({
  boxContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    flexWrap: 'wrap',
    padding: 10
  },
  box: {
    height: '100%',
    width: '100%',
    padding: 5,
    backgroundColor: 'green',
    borderRadius: 10
  },
  boxLight: {
    height: 70,
    width: '22%',
    padding: 5,
    backgroundColor: 'green',
    borderRadius: 10
  }
})
const DisconnectInnerWrapper = styled.View`
          position:absolute;
          width:100%;
          height:100%;         
          background-color:${props => props.colorTop || "#FF0000CC" };
          border-radius:12px;
          opacity:0.6;
         
`;