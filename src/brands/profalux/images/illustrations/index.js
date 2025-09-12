import React from 'react';

import { View,SafeAreaView,Text,StyleSheet,ImageBackground,Image,BackHandler } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '_theming/themeProvider';
import AccessButton from '_components/forms/accessButton';

import styled from 'styled-components/native'
//--- illustrations ---
import Welcome from '_brand/images/illustrations/welcome'
//--- Appium -----
import {buildTestId} from '_helpers/appium';

const AccessScreen = (props) => {
    const { t, i18n } = useTranslation();
    
    const {theme} = useTheme();

    const {move,serverError,isConnected} = props;
   
    const logTest = buildTestId("login");
    const signUpTest = buildTestId("signUp");

      const buttonStyle = {borderColor:'white',borderWidth:2,width:240};
      const titleStyle = {textTransform:'none',color:'white'}
      const backgroundImageStyle = {flex:1,alignItems:'center',justifyContent:'center',resizeMode:'cover',backgroundColor: 'rgba(0,0,0,1)'}


       return (
        <View style={[{flex:1,backgroundColor:'black'}]}>
            
                {!isConnected &&
                        <View style={{width:'100%',position:'absolute',alignItems:'center',paddingTop:20}}>
                            <Text style={{color:"white"}}>{t("NETWORK_IS_DECONNECTED")}</Text>
                        </View>

                }
                {serverError &&
                        <View style={{width:'100%',position:'absolute',alignItems:'center',paddingTop:20}}>
                            <Text style={{color:"white"}}>{t("SERVER_UNREACHABLE")}</Text>
                        </View>

                }
               
                <View style={{width:'100%',alignItems:'center',flex:2,alignItems:'center',justifyContent:'center',backgroundColor:'white'}}>
                <Welcome/>
                </View>                    
                
                
                <View style={{flex:1,justifyContent:'flex-end',alignItems:'center'}}>
                    <View style={{marginBottom:20,width:'100%',padding:20,alignItems:'center'}}>
                        <AccessButton title={t('ACCESS_SUBSCRIBE')} titleStyle={titleStyle} buttonStyle={buttonStyle} theme={theme} specialColor="#555" onPress={() => move('Subscribe')} testAppium={signUpTest}/>
                        <AccessButton title={t('ACCESS_CONNECT')} titleStyle={titleStyle} buttonStyle={buttonStyle} theme={theme} specialColor="#555" onPress={() => move('Login')} testAppium={logTest}/>                    
                    </View>
                </View>
           
        </View>
    );
    }

export default AccessScreen;

const styles = StyleSheet.create({
    insideBlock: {
      margin:10
     
    },
    buttonContainer: {
        width:'100%',
        marginTop:10,
        
    }
  });