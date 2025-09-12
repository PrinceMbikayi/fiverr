import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigation, useRoute, StackActions } from '@react-navigation/native';
import { View, Text, ImageBackground, Image, SafeAreaView } from 'react-native';
import { getUserCredentials } from '../../services/storage'
import { Api } from '_api';
import { appServerIsDown } from '_actions/network';
import { updateLanguage, updateCountry } from '_api/user';
import { getDeviceLang, getDeviceCountry } from '../../utils/langUtils';
import { getConfigFromServer } from "_api/config";
import { useAppGlobal } from '_helpers/appGlobalProvider';
import { useDispatch } from 'react-redux';
import objectsMapped from '_config/distantConfig.json';
/**
 * 
 */



const AuthLoadingScreen = () => {

  const navigation = useNavigation();
  const route = useRoute();

  const { setObjectsMap } = useAppGlobal();

  const dispatch = useDispatch();


  const _bootstrapAsync = async () => {

    //this.props.navigation.navigate('App')
    const AuthDestination = 'Auth';
    const grantedDestination = 'App';
    const credentials = await getUserCredentials();

    console.log("credentials >",credentials);
    //const {setObjectsMap} = useAppGlobal()
    console.log("authLoadingScreen", this.props)
    if (credentials.error) {

      navigation.navigate(AuthDestination);
    } else {

      // get config First
      // load config

      const lConfig = await getConfigFromServer().catch((err) => console.log(err));
      console.log(" external Config", lConfig?.res)
      if (lConfig?.errCode == 200) {
        console.log("ok ok ok")
        setObjectsMap(lConfig.res);
      } else {
        setObjectsMap(objectsMapped)
      }


      //
      console.log("après")
      // check if credentials are ok
      let isGranted = await Api.checkUserIsGranted();
      console.log("isGranted XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX from authLoadingScreen ", isGranted)

      if (isGranted == true) {

        console.log("Granted Destination", grantedDestination);
        const serverState = appServerIsDown(false)
        console.log("serverState", serverState);
        dispatch(serverState)
        console.log(this.props)
        // GET DATAS FROM SERVER        
        let doContinue = await Api.getObjects();
        const doRooms = await Api.getRooms();
        if (doContinue) navigation.navigate(grantedDestination);

        // SET USER LANG PREF
        const lang = getDeviceLang();
        console.log("lang ======================== ", lang);
        updateLanguage(lang)
        const country = getDeviceCountry();
        updateCountry(country);

        // Server is up


      } else {
        console.log("isGranted is YYYYYYYY ", isGranted)
        const params = (isGranted !== false) ? { 'network': 'error' } : { 'network': "ok" };
        switch (isGranted?.errCode) {
          case 400:
          case 401:
            //navigation.navigate('Subscribe');
            navigation.navigate('Auth', {Screen:'Login'});
            break;

          default:
            navigation.navigate('Auth', params);

        }
        /*
        if(isGranted?.errCode == 401) {
          navigation.navigate('Login');
        }  else {
          navigation.navigate('Access',params);
        }
        */
      }
    }

  };

  useEffect(() => {
    _bootstrapAsync();
  }, []);





  const backgroundImageStyle = { flex: 1, alignItems: 'center', justifyContent: 'center', resizeMode: 'cover', backgroundColor: 'rgba(0,0,0,1)' }

  return (
    <View style={[{ flex: 1, justifyContent:'center', alignItems:'center', backgroundColor: '#3E495E' }]}>

      <Image source={require('_images/interfaces/profalux-loadScreen.png')} style={{width:300, height:300}} imageStyle={{ opacity: 0.6 }} fadeDuration={0}>
      </Image>

    </View>
  )
}

export default AuthLoadingScreen