//import '../../locales'
import React, {StyleSheet} from 'react';

import {View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Gauge} from '../illustrations';
import {ThemeProvider} from 'styled-components/native';
import ScreenHeader from '../../components/ui/header';

//-----------------------------------------------------
import {useTheme} from '_theming/themeProvider';
import {H1, P, VSeparator} from '_brand/templates/styled';
import Button from '_brand/templates/components/ui/Button';

const MotorTestScreen = props => {
  const {t} = useTranslation();
  const tns = 'motor';

  const {theme, baseColors} = useTheme();
  const {textColor} = baseColors;

  const navigation = useNavigation();
  const route = useRoute();
  const navigationParams = route?.params || {};

  console.log('MotorTest screen navigationParams', navigationParams);

  const title = 'TEST_TITLE';
  const description = 'TEST_DESCRIPTION';
  const screenHeaderTitle = 'TEST_HEADER_TITLE';

  const goNextPage = () => {};

  const styledTheme = {textColor: textColor};

  const goBack = () => {
    navigation.goBack();
  };

  const showInfos = () => {
    //
  };

  const goParameters = () => {
    console.log('ici ?');
    navigation.navigate('AddMotorParameters');
  };

  return (
    <ThemeProvider theme={styledTheme}>
      <ScreenHeader
        title={t(tns + ':' + screenHeaderTitle)}
        goBack={goBack}
        showInfos={showInfos}
      />
      <View style={styles.bodyWrapper}>
        <View>
          <View style={styles.gaugewrapper}>
            <Gauge />
          </View>
        </View>
        <VSeparator height={24} />
        <View>
          <H1>{t(tns + ':' + title)}</H1>
          <VSeparator />
          <P>{t(tns + ':' + description)}</P>
          <VSeparator />
          <Button
            title={t(tns + ':' + 'TEST_BUTTON_TEST')}
            onPress={goNextPage}
            bgColor={theme.primary_1_light}
          />
          <VSeparator height={8} />
          <Button
            title={t(tns + ':' + 'TEST_BUTTON_IGNORE') + 'AAA'}
            onPress={goParameters}
            bgColor={'transparent'}
          />
        </View>
      </View>
    </ThemeProvider>
  );
};

export default MotorTestScreen;

const styles = StyleSheet.create({
  bodyWrapper: {
    padding: 16,
  },
  gaugewrapper: {
    width: '100%',
    height: 240,
    backgroundColor: '#DDD',
  },
});
