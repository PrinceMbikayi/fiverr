import '../../../locales';
import '_brand/templates/screens/productsRelated/_locales';
import React from 'react';
import {useState, useRef, useEffect, useCallback} from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation, useRoute, StackActions} from '@react-navigation/native';
import PagerView from 'react-native-pager-view';
import LottieView from 'lottie-react-native';

import {ThemeProvider} from 'styled-components/native';

//-----------------------------------------------------
import {useTheme} from '_theming/themeProvider';
import ScreenHeader from '../../../components/ui/header';
import ScreenHeaderComp from '../../../components/ui/headerTestDoc';
import {useGlobalModal} from '_components/ui/globalModal';
import Illustration from '_images/illustrations/startQAir.js';
import {H1, H2, H3, P, ViewPagerStep} from '_brand/templates/styled';
import Button from '_brand/templates/components/ui/Button';

import {steps} from './config';

//import CheckBlueToothScreen from '../../../components/checkBlueTooth';
import CreateObjectWatcher from '../../components/waitForObjectCreationOnServer';

import ActiveScanPage from './pages/activeScan';

import {createWeatherObject} from '_api/Api';

const PageIndicators = props => {
  const radius = 14;
  const pad = 4;
  const {currentPageIndex, maxPages, color} = props;

  const PageIndicator = ({isCurrent}) => {
    const bgColor = isCurrent ? color : 'transparent';
    return (
      <View
        style={{
          margin: pad,
          width: radius + pad,
          height: radius + pad,
          borderRadius: (radius + pad) / 2,
          backgroundColor: bgColor,
          borderWidth: 2,
          borderColor: color,
        }}
      />
    );
  };
  console.log('maxPages', maxPages);
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
      }}
    >
      {[...Array(maxPages)].map((v, i) => {
        console.log('i2', i, currentPageIndex);
        return (
          <PageIndicator isCurrent={i == currentPageIndex} key={'pik_' + i} />
        );
      })}
    </View>
  );
};

const ScanScreen = props => {

  console.log("ScanScreen ==> RRRRRRRRRRRRRRRRRRRRRRRRRRRRR")
  const isMounted = useRef(false);
  const {t, i18n} = useTranslation();
  const tns = 'bluetooth';

  const checkBluetoothRef = useRef();
  const globalModal = useGlobalModal();
  const [isBluetoothAvailable, setIsBluetoothAvailable] = useState(false);

  const {theme, baseColors} = useTheme();
  const {
    bgColor,
    textColor,
    headerBackgroundColor,
    headerTextColor,
  } = baseColors;

  const navigation = useNavigation();
  const route = useRoute();
  const navigationParams = route?.params || {};
 
  const maxPages = 2;
  const [currentPage, setCurrentPage] = useState(0);
  const title = steps[currentPage]?.title;
  const description = steps[currentPage]?.title;

  const endCallback = props.endCallback;
  const indexCallback = props.indexCallback;
  const changedPosition = props.currentPosition;

  const pagerRef = useRef(null);

  const goBack = () => {
    const nextIndex = currentPage - 1;
    if (nextIndex < 0) {
      navigation.goBack();
    } else {
      setCurrentPage(nextIndex);
      pagerRef.current.setPage(nextIndex);
    }
  };

  const goToNextScreen = () => {
    navigation.navigate('AddMotorTest');
  };

  const goNextPage = () => {
    console.log('currentPage', currentPage);
    console.log('pagerREf', pagerRef);
    const nextIndex = currentPage + 1;
    if (nextIndex >= maxPages) {
      goToNextScreen();
    } else {
      setCurrentPage(nextIndex);
      pagerRef.current.setPage(nextIndex);
    }
  };

  const onPageSelected = e => {
    const position = e.nativeEvent.position;
    //  pageRefCurrentPage.current = position;
    const index = setCurrentPage(position);
    //if (indexCallback) indexCallback(index, pagerTitles[index]);
  };

  const showInfos = () => {
    console.log('show infos');
  };

  //-------- bluetooth ----------
  const checkBluetooth = async () => {
    console.log('[bluetooth pairing] checkBluetooth');
    const val = await checkBluetoothRef.current.check();
    checkBluetoothRef.current;
    if (val == 'on') {
      continueAction();
    }
  };
  const continueAction = () => {
    console.log('continueAction >>>>>>> aaaaaa');
    setIsBluetoothAvailable(true);
    globalModal.close();
    /*
        const pushAction = StackActions.push('MotorAutoLearn', { user: 'Wojtek' });
        navigation.dispatch(pushAction);
        globalModal.close();
        */
  };

  const onCancelBluetooth = () => {
    navigation.goBack();
  };

  const onBlueToothAvailable = () => {
    console.log('onBlueToothAvailable !!!!!!!!!!!!!!');
    continueAction();
  };

  useEffect(() => {
   // checkBluetooth();
   console.log("checkBluetooth à remettre en place")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [createDetails, setCreateDetails] = useState(null);

  const devName = 'testAddHeater';
  const addProduct = datas => {
    console.log('addProduct', datas);
    pagerRef.current.setPage(1);
    setCreateDetails({name: devName});
    createWeatherObject(devName, 6455259);
  };

  const onDeviceCreatedOnServer = id => {
    console.log('device created on server !!!', id);
    console.log('so move', navigationParams);
    const nextDestination = navigationParams?.nextDestination;
    if (nextDestination) {
      navigation.navigate(nextDestination, {itemId: id});
    }
  };

  //-------------------------------

  const bodyTextColor = textColor;
  const backgroundColor = bgColor;
  const styledTheme = {textColor: textColor};
  return (
    <ThemeProvider theme={styledTheme}>
      {/*}
      <CheckBlueToothScreen
        ref={checkBluetoothRef}
        manualCheck
        onBlueToothAvailable={onBlueToothAvailable}
        onCancelBluetooth={onCancelBluetooth}
      />
      <ScreenHeader
        title={t(tns + ':' + 'GUIDE_TITLE') + ' SCAN'}
        goBack={goBack}
        showInfos={showInfos}
      />
      */}
      <PagerView
        initialPage={0}
        style={{flex: 1}}
        ref={pagerRef}
        onPageSelected={onPageSelected}
      >
        <View style={{backgroundColor: 'transparent', padding: 16}} key="1">
          <ActiveScanPage
            canStart={isBluetoothAvailable}
            addProduct={addProduct}
          />
        </View>
        <View style={{backgroundColor: 'transparent', padding: 16}} key="2">
          <View>
            <CreateObjectWatcher
              objectDetails={createDetails}
              callback={onDeviceCreatedOnServer}
            >
              <View style={{height: 180, backgroundColor: 'transparent'}}>
                <LottieView
                  source={require('../../../lotties/121139-atom-loopable-loader.json')}
                  autoPlay
                  loop
                />
              </View>
              <H3 style={{textAlign: 'center'}}>
                {t(tns + ':' + 'WAIT_PLEASE')}
              </H3>
            </CreateObjectWatcher>
          </View>
        </View>
      </PagerView>
      {/*
            <View style={{height:20,marginBottom:20}}>
                        <PageIndicators currentPageIndex={currentPage} maxPages={maxPages} color={theme.neutral_dark}/>
                    </View>
    */}
    </ThemeProvider>
  );
};

export default ScanScreen;
