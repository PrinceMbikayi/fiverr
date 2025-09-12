import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView } from 'react-native';
import styled from 'styled-components/native'
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';

import { useMimic } from '_hooks/mimic';
import { useObject } from '_hooks/object';
import { useTheme } from '_theming/themeProvider';

import { StyledCardView, StyledInnerCardView, StyledCardGeneralInnerWrapper, StyledSideView, StyledHeaderView, DisconnectedViewOverlay, DisconnectedText } from './styled'

import Chevron from '_brand/images/icons/app/ArrowRight1';
import {iconsJs} from '_brand/utils/iconsJs';
import Setting2 from '_brand/images/icons/app/Setting2';

import { RoutineWidgetLine } from "_brand/templates/components/objects/common/RoutineWidgetLine";


import { PureItemRenderMenu } from '_components/list/pureItemRender/menu/index.js';

const PureItemRenderRoutineTemplate = (props) => {

  const { itemId, availableCommands, netInfoIsConnected, forceDisplay, typeDynamic, goLevel2, goSettings, listId, modal } = props;
  console.log("PureItemRender Brand >>",props)

  const {isRoutine} = props;

 
  const navigation = useNavigation();
  const route = useRoute();
  const navigationParams = route?.params || {};
  const uObject = useObject(itemId);
  const { getId, objectDatas: itemDatas, execute } = uObject;
  if (itemDatas?.flags?.hidden == true) return null;
  const { typeName, connected, statusDictionary: statuses, className } = itemDatas;
  const uniType = uObject?.objectDatas?.uniType
  console.log("OBJECT CONNECTED STATE :",className)

  const { t, i18n } = useTranslation();
  const { theme } = useTheme();

  const widgetbgColor = theme?.prflxwidgetbgColor||'white';
  const textColor = theme?.prflxTextColor||'black'

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

  const HALF_WIDGET_TYPE_NAMES =  ['LightEzsp', 'SwitchEzsp', 'EzspProbe', 'NetatmoStation', 'NetatmoIndoorProbe','NetatmoOutdoorProbe','NetatmoRainGauge','NetatmoWindGauge','Application']

  return (
    <SafeAreaView >
      <StyledCardView bodyBgColor={widgetbgColor} widthSize={HALF_WIDGET_TYPE_NAMES?.includes(typeName)? '100%' : '100%'}>
        <StyledCardGeneralInnerWrapper heightPercent={100} widthPercent={100} bodyBgColor={'transparent'}>
        <DisconnectInnerWrapper 
            heightPercent={100} 
            widthPercent={100} 
            colorTop={(connected == false || !netInfoIsConnected)?
                                                                    theme['card--color--deactivated-overlay']
                                                                 :  'transparent'} 
            style={{zIndex: (connected == false || !netInfoIsConnected)? 2 : 0}}/>
          <StyledInnerCardView widthPercent={ HALF_WIDGET_TYPE_NAMES?.includes(typeName) || HALF_WIDGET_TYPE_NAMES?.includes(uniType)? 65 : 85}  bodyBgColor='transparent'>
            {typeDynamic}
          </StyledInnerCardView>
          <StyledSideView widthPercent={15} heightPercent={100} bgColor={'transparent'} style={{zIndex:3}} >
            {typeName != "Associations" &&
              <>
                {(isRoutine == true && className == "Light")?
                  <></>
                  :
                  <Pressable onPress={goLevel2} style={{width: 22, height: 25, opacity:(connected == false || !netInfoIsConnected)? 1:0.5}}>
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