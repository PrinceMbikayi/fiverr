import React,{useEffect,useState,useRef} from 'react';
import { View, Text, StyleSheet, TouchableOpacity,Pressable } from 'react-native';
import {useTranslation} from 'react-i18next';
import styled, {ThemeProvider} from 'styled-components/native';
import {useTheme} from '_theming/themeProvider';

import PageIllustration from '../../illustrations/WifiSelect';
import PopUpIllustration from '../../illustrations/WifiWarning';
import Wifi from '_images/icons/app/Wifi';
import WifiConnect from '_images/lotties/wifi';
import TickCircleBold from '_images/icons/app/TickCircleBold.js';
import WifiSuccess from '_images/illustrations/WifiSuccess';

import {H1, H1PopUp, H3, P, VSeparator, IllustrationVSeparator} from '_brand/templates/styled';
import FormInput from '_components/forms/formInput';
import Button from '_brand/templates/components/ui/Button';
//------- popups -----------------

import {useGlobalModal} from '_components/ui/globalModal';
import {ScanNetworks,FoundNetworks} from '../popups/networks';


const connectPage = (props) => {
    

      const initPassswordValue = ""; // (process?.env?.NODE_ENV == "development")? "1234" : "";
      const [password, setPassword] = useState(initPassswordValue);

    const onChangeWithRulesExternal = (value) => {
        console.log("onChangeWithRulesExternal",value);
        setPassword(value);
        //onChangeWithRules(value);
    }

    const { t, i18n } = useTranslation();

    const tns = 'motor';
    const {theme, baseColors} = useTheme();


    const goNextPage = () => {
        console.log('goNextPage')
    }

    const passwordRef = useRef();

    return (
        <>
        <View style={{marginTop: 36, backgroundColor: 'transparent'}}>
                
                      <FormInput
                        name="password"
                        value={password}
                        placeholder={t('Enter password')}
                        secureTextEntry
                        passwordToggle
                        onChangeText={onChangeWithRulesExternal}
                        ref={passwordRef}
                        returnKeyType="done"
                        iconName="ios-lock"
                        iconColor="#2C384A"
                        bgColor="white"
                        color="#2C384A"
                      />
                   
                  </View>
                  <VSeparator />
                  <View>
                
                        <View style={{height:16}}/> 
                    <Button
                      title={t(tns + ':' + 'WIFI_CONNECT_BUTTON')+ ""}
                      onPress={goNextPage}
                      bgColor={theme.primary_1_light}
                     
                    />
                  </View>
                  </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default connectPage;





const WifiWrapper = styled.View`
  border-radius: 12px;
  border-width: 1.5px;
  border-color: black;
  flex: 1;
  min-height: 64px;
  flex-direction: row;
  padding: 16px;
  align-items: center;
  background-color:red;
`;

const SuccessView = styled.View`
  background-color: ${attrs => attrs.bgColor || 'red'};
  border-radius: 16px;
  border-width: 1px;
  border-color: ${attrs => attrs.borderColor || 'yellow'};
  flex-direction: row;
  padding: 8px;
  align-items: center;
  margin-left: 8px;
  margin-right: 8px;
`;























                  