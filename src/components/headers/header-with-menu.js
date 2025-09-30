import React, {useContext} from 'react';
import {View, Text, TouchableWithoutFeedback, Image} from 'react-native';

//import {SvgCss} from 'react-native-svg';
import {SvgCss} from 'react-native-svg/css';

import {useTheme} from '_theming/themeProvider';
import {ShadowBorder} from '_components/ui/shadow-border';
import {airHomeIcons} from '_assets/icons/airhomeIcons';
import {
  StyledHeaderView,
  StyledMenuBurger,
  StyledTitle,
  H1,
} from './headerStyled';

import {useNavigation, useFocusEffect} from '@react-navigation/native';

import ExtraButtons from './extraButtons';

//--- Appium -----
import {buildTestId} from '_helpers/appium';

const getId = id => {
  return buildTestId(id);
};

export const HeaderWithMenu = props => {
  const {
    title,
    noShadow,
    bgColor: pBgColor,
    hideBurger,
    extraButtons: options,
  } = props;
  const {theme} = useTheme();

  const navigation = useNavigation(); //v5

  const bgColor = pBgColor || theme['drawer--color--bg'] || 'yellow';
  const color = 'white';
  const burgerImage = theme['header--menu--burger'];

  const testId = getId('burger');

  const openDrawer = () => {
    navigation.toggleDrawer();
  };

  const showShadow = () => {
    if (noShadow || theme.key == 'AIRWELL') {
      return null;
    } else {
      return <ShadowBorder />;
    }
  };

  const showBrand = () => {
    if (theme.key == 'AIRWELL') {
      return (
        <SvgCss
          style={{alignSelf: 'center', marginRight: 10}}
          xml={airHomeIcons['logo']}
          width={34}
          height={34}
          fill={theme.logoColor}
          viewBox="0 0 48 48"
          preserveAspectRatio="xMinYMin slice"
        />
      );
    } else {
      return null;
    }
  };

  return (
    <>
      <StyledHeaderView bgColor={bgColor || 'transparent'}>
        {!hideBurger && (
          <TouchableWithoutFeedback
            onPress={openDrawer}
            style={{alignItems: 'center'}}
            accessibilityLabel="drawer_toggle"
            {...testId}>
            <StyledMenuBurger source={burgerImage} />
          </TouchableWithoutFeedback>
        )}
        <StyledTitle>
          <H1>{title}</H1>
        </StyledTitle>
        {showBrand()}
        <ExtraButtons {...{options, title, color}} />
      </StyledHeaderView>
      {showShadow()}
    </>
  );
};
