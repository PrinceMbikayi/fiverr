import '_brand/templates/screens/_locales';
//import '../_locales'

import React from 'react';
import {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Image,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useTranslation} from 'react-i18next';

//import AccessButton from '_components/forms/accessButton';
import AccessButton from '_brand/templates/components/forms/accessButton';

import styled from 'styled-components/native';

//--- theme ---
import {useTheme} from '_theming/themeProvider';

//--- illustrations ---
import Welcome from '_brand/images/illustrations/welcome3';

//--- styled Components
import {H2, P} from '_brand/templates/styled';

//--- logos ---
import LogoGoogle from '_brand/images/logos/js/Google';
import LogoApple from '_brand/images/logos/js/Apple';
import LogoAmazon from '_brand/images/logos/js/Amazon';
import MailIcon from '_brand/images/icons/app/Sms';

//---- hooks -----
import {useUser} from '_hooks/useUserHigher';

//--- Appium -----
import {buildTestId} from '_helpers/appium';
import {color} from 'react-native-reanimated';

// Add API import for debugging
import {Api} from '_api';

const AccessScreen = props => {
  const {t, i18n} = useTranslation();

  const {theme} = useTheme();
  const uUser = useUser();
  const {getCredentials} = uUser;

  const {move, serverError, isConnected, oAuth, showServerSelectorTap} = props;
  console.log('ACCESS_PROPS :', props);

  const logTest = buildTestId('login');
  const signUpTest = buildTestId('signUp');

  const buttonStyle = {
    borderColor: 'white',
    borderWidth: 0,
    borderRadius: 16,
    width: 260,
    marginBottom: 0,
    backgroundColor: 'white',
  };
  const titleStyle = {textTransform: 'none', color: 'black'};
  const defaultButtonProps = {titleStyle, buttonStyle, specialColor: '#555'};

  const onSelectServerTap = () => {
    if (showServerSelectorTap) showServerSelectorTap();
  };

  // Add debug state
  const [debugTapCount, setDebugTapCount] = useState(0);
  const [isDebugging, setIsDebugging] = useState(false);

  // Debug function to test connectivity
  const testConnectivity = async () => {
    setIsDebugging(true);
    try {
      console.log('=== DEBUG: Testing connectivity ===');

      // Test basic network connectivity
      const response = await fetch('http://10.0.2.2:3000/health', {
        //const response = await fetch('http://localhost:3000/health', {
        method: 'GET',
        timeout: 5000,
      });

      console.log('Network test response:', response.status);

      // Test API endpoint
      const apiTest = await Api.getObjects().catch(err => {
        console.log('API test error:', err);
        return {error: err};
      });

      console.log('API test result:', apiTest);

      Alert.alert(
        'Debug Results',
        `Network: ${response.ok ? 'OK' : 'Failed'}\nAPI: ${
          apiTest.error ? 'Failed' : 'OK'
        }\nCheck console for details`,
        [{text: 'OK'}],
      );
    } catch (error) {
      console.log('Debug test error:', error);
      Alert.alert(
        'Debug Error',
        `Connection failed: ${error.message}\nCheck console for details`,
        [{text: 'OK'}],
      );
    } finally {
      setIsDebugging(false);
    }
  };

  // Handle debug tap on logo
  const handleLogoTap = () => {
    const newCount = debugTapCount + 1;
    setDebugTapCount(newCount);

    if (newCount >= 5) {
      testConnectivity();
      setDebugTapCount(0);
    }

    // Also call the original server selector tap
    onSelectServerTap();
  };

  const RenderGoogle = () => {
    return (
      <View style={{width: 16, height: 16}}>
        <LogoGoogle />
      </View>
    );
  };
  const RenderApple = () => {
    return (
      <View style={{width: 16, height: 16}}>
        <LogoApple color="white" />
      </View>
    );
  };

  const borderColor = theme?.prflxBorderColor || 'orange';
  const Containerbgcolor = theme?.prflxContaintBgColor || 'white';
  const bgcolor = theme?.prflxbgColor || 'white';
  const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor || 'white';
  const textColor = theme?.prflxTextColor || 'black';
  const headerBgColor = theme?.prflxHeaderBackground || '#FFFFFF';

  const DEVICE_HEIGHT = Dimensions.get('screen').height;
  const DEVICE_WIDTH = Dimensions.get('window').width;

  const background = require('_brand/images/icons/app/background.png');
  const splashScreen = require('_brand/images/icons/app/calypshomesplash.png');
  const imageSourceAccess = require('_brand/images/icons/app/accessBgImage.png');

  const [hasCredentials, setHasCredentials] = useState(false);

  useEffect(() => {
    (async () => {
      const result = await getCredentials();
      console.log('ACCESS in init getCredentials', result);
      setHasCredentials(!result?.error);
    })();
    console.log('TEst hasCredentials !!!!!!!!');
  }, []);

  useEffect(() => {
    console.log('hasCredentials : ', hasCredentials);
  }, [hasCredentials]);

  let content;

  if (!isConnected && hasCredentials) {
    content = (
      <View
        style={[
          {
            flex: 1,
            backgroundColor: bgcolor,
            alignItems: 'center',
            justifyContent: 'center',
          },
        ]}>
        <Image
          source={background}
          style={{
            resizeMode: 'cover',
            width: DEVICE_WIDTH,
            height: DEVICE_HEIGHT,
            zIndex: -1,
            position: 'absolute',
            top: 0,
          }}
        />
        <Image
          source={splashScreen}
          style={{
            resizeMode: 'contain',
            width: DEVICE_WIDTH,
            height: DEVICE_HEIGHT,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        />

        <View
          style={{
            backgroundColor: '#ff0202',
            width: '80%',
            height: '10%',
            position: 'absolute',
            top: '45%',
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: 10,
            borderRadius: 12,
          }}
          zIndex={133}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              color: 'white',
              textAlign: 'center',
            }}>
            {t('NETWORK_IS_DECONNECTED')}
          </Text>
        </View>
      </View>
    );
  } else {
    content = (
      <View
        style={[
          {
            flex: 1,
            backgroundColor: bgcolor,
            paddingVertical: 100,
            alignItems: 'center',
            justifyContent: 'center',
          },
        ]}>
        <Image
          source={imageSourceAccess}
          style={{
            width: DEVICE_WIDTH,
            height: DEVICE_HEIGHT,
            zIndex: -2,
            position: 'absolute',
            top: 0,
          }}
        />
        <TouchableOpacity onPress={handleLogoTap}>
          <Image
            source={require('_brand/images/icons/app/profaluxIconJs/Logo.png')}
          />
          {debugTapCount > 0 && (
            <Text
              style={{
                color: textColor,
                textAlign: 'center',
                fontSize: 12,
                marginTop: 5,
              }}>
              Debug: {debugTapCount}/5 {isDebugging ? '(Testing...)' : ''}
            </Text>
          )}
        </TouchableOpacity>

        {!isConnected && (
          <View
            style={{
              width: '100%',
              position: 'absolute',
              alignItems: 'center',
              paddingTop: 20,
            }}>
            <Text style={{color: textColor}}>
              {t('NETWORK_IS_DECONNECTED')} AAA{hasCredentials} BBB
            </Text>
          </View>
        )}
        {serverError && (
          <View
            style={{
              width: '100%',
              position: 'absolute',
              alignItems: 'center',
              paddingTop: 20,
            }}>
            <Text style={{color: textColor}}>{t('SERVER_UNREACHABLE')}</Text>
          </View>
        )}

        <View style={{paddingRight: 44, paddingLeft: 44, marginTop: 32}}>
          {/* <H2 color={textColor}>{t('account:WELCOME')}</H2> */}
          <Text style={{color: textColor, textAlign: 'center'}}>
            {t('account:DESCRIPTION')}
          </Text>
          <View style={{fustifyContent: 'flex-end', alignItems: 'center'}}>
            <View
              style={{
                marginBottom: 20,
                width: '100%',
                padding: 40,
                alignItems: 'center',
              }}>
              {/* <AccessButton titleStyle={{color:'red'}} title={t('account:APPLE_CREATE')} {...defaultButtonProps} onPress={() => oAuth("apple")} icon={<RenderApple/>} testAppium={signUpTest}/>
                                <AccessButton  title={t('account:GOOGLE_CREATE')} {...defaultButtonProps} onPress={() => oAuth("google")} icon={<RenderGoogle/>} testAppium={signUpTest}/> */}
              {/* <AccessButton title={t('account:AMAZON_CREATE')} {...defaultButtonProps} onPress={() => move('Subscribe',"amazon")} icon={<LogoAmazon/>} testAppium={signUpTest}/>  */}
              <AccessButton
                title={t('account:EMAIL_CREATE')}
                {...defaultButtonProps}
                onPress={() => move('Subscribe')}
                icon={<MailIcon color="#FFAA0B" />}
                testAppium={logTest}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }

  return <View style={{flex: 1}}>{content}</View>;
};

export default AccessScreen;

const WelcomeView = styled.View`
  flex: 1;
  background-color: white;
  border-bottom-left-radius: 32px;
  border-bottom-right-radius: 32px;
  padding-left: 44px;
  padding-right: 44px;
  align-items: center;
  justify-content: flex-end;
`;
