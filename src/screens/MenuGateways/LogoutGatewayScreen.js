import React from 'react';
import {useRef,useEffect} from 'react';
import { View, Text,ActivityIndicator, StatusBar } from 'react-native';
import {Api} from "../../api";
import {Ws} from "../../ws";

import { useUser } from '_hooks/useUserHigher';


const LogoutScreen = (props) => {


  const navigation = props.navigation;
  const isMounted = useRef(false)

  const uUser = useUser();
  const {isLoggedIn} = uUser

  useEffect(() => {
    isMounted.current = true;   
    /*    
    console.log("logout",props)
    const doLogout = async() => {
      await Api.logout();
      navigation.navigate('Auth',{ screen: 'Access' });
      console.log("je devrais être allé sur Auth / Access")
    }
    doLogout();
    */
    // WILL UNMOUNT
    return () => (isMounted.current = false)
  }, []);

  console.log("logoutscreen >>>",uUser)

  useEffect(()=> {
   
    console.log("logoutXX",uUser);
   
    const doLogout = async() => {
      console.log("before Call =>")
      const callLogout = await Api.logout().catch((err) => console.log("alorss",err));
      console.log("callLogout =>",callLogout)
      navigation.navigate('Auth',{ screen: 'Access' });
      console.log("je devrais être allé sur Auth / Access")
    }
    if(isLoggedIn == true) {
      doLogout();
    } else {
      console.log("dejà deloggué")
    }
   
  },[uUser])

  




  return (
    <View>
      <ActivityIndicator />
      <StatusBar barStyle='default' />
      <Text>logout gateway</Text>
    </View>
  );

}

export default LogoutScreen;


/*
export default class LogoutScreen extends React.Component {
  async componentDidMount() {
    console.log("here")
      //await Api.logout();

      
  }

  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle='default' />
      </View>
    );
  }
}

*/