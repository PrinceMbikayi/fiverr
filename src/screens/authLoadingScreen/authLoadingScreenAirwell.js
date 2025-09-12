import React from 'react';
import {
  Animated,
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
  Text,ImageBackground,Image
} from 'react-native';
import {getUserCredentials} from '../../services/storage'
import { Api } from '../../api';
import { withTheme } from '_theming/themeProvider';
/**
 * 
 */

class AuthLoadingScreen extends React.Component {

  animDuration = 500;
  animDelay = 500;
  barHeight = 20;
  state = {
    fadeAnim: new Animated.Value(0),
    imageUp: new Animated.Value(0),
    redBar: new Animated.Value(0),
    rFade: new Animated.Value(0),
    endingAnim: new Animated.Value(0)
  };

  fadeIn = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(this.state.fadeAnim, {
      toValue: 33,
      delay:this.animDelay,
      duration: 1000
    }).start();
    Animated.timing(this.state.imageUp, {
      toValue: -20,
      delay:600,
      duration: 1000,
     
    }).start();
    Animated.timing(this.state.redBar, {
      toValue: -1*this.barHeight,
      delay:700,
      duration: 1000
    }).start();
    Animated.timing(this.state.rFade, {
      toValue: 1,
      delay:300,
      duration: 1000
    }).start();
    Animated.timing(this.state.endingAnim, {
      toValue: 1,
      delay:300,
      duration: 2000
    }).start(({finished}) => {
     
      //console.log('--------- animation finished ----------')
      this._bootstrapAsync();
      //console.log('--------- _bootstrapAsync called ----------')
    });
  };

  componentDidMount() {
    //this._bootstrapAsync();
    this.fadeIn()
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {

    //this.props.navigation.navigate('App')
    const  AuthDestination = 'Auth';
    const grantedDestination = 'App';
    const credentials = await getUserCredentials();
   
    console.log("credentials first query >",credentials);

    if(credentials.error){
    
       this.props.navigation.navigate(AuthDestination);
    } else {

        // check if credentials are ok
        let isGranted = await Api.checkUserIsGranted();
       
        console.log("isGranted",isGranted)
        if(isGranted) {

          // GET DATAS FROM SERVER
          console.log('Get Objects in starting Process')
          let doContinue = await  Api.getObjects();
          console.log('After Get Objects in starting Process')
          if(doContinue) this.props.navigation.navigate(grantedDestination);
         
        } else {
          this.props.navigation.navigate(AuthDestination);
        }

    }

  };

  // Render any loading content that you like here
  render() {
   
    return (
      <View style={{ flex: 1,backgroundColor:this.props.theme.primary}}>
          
            <View style={{width: '100%', height: '100%',position:'absolute',alignItems:'center',justifyContent:'center'}}>
                    <View style={{width:'100%',alignItems:'center'}}>
                            <Image source={require('_images/interfaces/airwell/airhome_logo.png')} style={{width:150,resizeMode: 'contain'}} fadeDuration={0}/>
                    </View>                    
            </View>
        </View>
       
    );
  }
}

export default withTheme(AuthLoadingScreen)

/*
<View style={{ flex: 1}}>

       
<ImageBackground source={require('_images/interfaces/splash.jpg')} style={{flex:1}} fadeDuration={0}>
<View style={{flex:100}}></View>
<Animated.View style={{flex:this.state.fadeAnim,backgroundColor:'yellow'}}></Animated.View>
</ImageBackground>
</View>

*/