import React, { useEffect } from 'react';
import { View, StyleSheet, Pressable, SafeAreaView } from 'react-native';
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

const PureItemRenderTemplate = (props) => {

  const { itemId, availableCommands, netInfoIsConnected, typeDynamic, goLevel2, goSettings, listId, modal } = props;
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

  const onGoLevel2 = () => {
    console.log("hop là")
    //goLevel2();
  }

  const getButtons = () => {
    let retVal = [];
    if (uObject.extraConfig?.showConfig == true) retVal.push({ action: goSettings, svgr: <Setting2 color="black" /> })
    if (uObject.extraConfig?.noLevel2 != true) retVal.push({ action: onGoLevel2, svgr: <View style={{ width: 30, height: 30 }}><Chevron color="white" /></View> })
    return retVal;
  }

  //allow level2 access to diconnected Object
  const allowAccessLevel2 = true


  return (
    <SafeAreaView >
      <StyledCardView bodyBgColor={widgetbgColor}>

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

            <StyledSideView  heightPercent={100} bgColor={'transparent'} zIndex={(allowAccessLevel2) ? 12 : 1} >
              {(typeName != "Associations" && typeName !="application") &&
                <>
                    <Pressable onPress={goLevel2} style={{width: 22,borderRadius:10, backgroundColor:'transparent', height: '100%', opacity:(connected == false || !netInfoIsConnected)? 1:0.5}}>
                      <iconsJs.rightChevronIcon.name  nocolor={textColor } color={ ((connected == false || !netInfoIsConnected) && !allowAccessLevel2)? 'white':textColor} />
                    </Pressable>
                </>
              }

            </StyledSideView>
        </StyledCardGeneralInnerWrapper>
      </StyledCardView>
    </SafeAreaView>
  )
}


export default PureItemRenderTemplate


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