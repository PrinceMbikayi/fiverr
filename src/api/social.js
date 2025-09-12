import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
// may be use @react-native-firebase/auth later instead of @react-native-google-signin/google-signin
// due to the lack of evolution of @react-native-google-signin/google-signin
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { appleAuth, AppleButton } from '@invertase/react-native-apple-authentication';
import {Api} from './index'
import { setSecureSorage } from '_services/storage';

import {webClientId as webClientIdGoogle} from '_brand/config/signInGoogle';

const googleAuth = async (props) => {

    //console.log("googleAuth Social API");

    const creation = (props) ? props?.creation : null;
    /*
    const apps = firebase.apps;    
    apps.forEach(app => {
        console.log('App name: ', app.name);
    });
    */
    const hasPlayServices = await GoogleSignin.hasPlayServices();
    //console.log("hasPlayServices",hasPlayServices);
    
   
    GoogleSignin.configure({
        webClientId: webClientIdGoogle,
        offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
        forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
    });
   
     
    let signInResponse = null;
    let idToken;

    // create account or log again
    if(creation) {
     // this display the select account and agree Popup from Google   
        signInResponse = await GoogleSignin.signIn().catch((err) => console.log("err++",err)); 
        /*
        console.log("signInResponse de Google",signInResponse)
        console.log("---------------------------");
        console.log(JSON.stringify(signInResponse));
        console.log("-------------------------- 2 -");

        //idToken = signInResponse;
        */
    }

    const isSignedIn = await GoogleSignin.isSignedIn();
    if(isSignedIn) {
        const currentUser = await GoogleSignin.getCurrentUser();
        console.log("currentUser",currentUser);       
       idToken = currentUser?.idToken;
       await  setSecureSorage('google',JSON.stringify(idToken),'google')
    }
     
    if(idToken) {
        const createResponse = await Api.socialLogin(idToken,'google').catch((err)=> console.log("socialcreate",err));
        
        console.log("so it's ok",createResponse)
    }

    return idToken;

  }




// ==============================================
export const logWithGoogle = async() => {   
    const tokenValue = await googleAuth();   
    return {"tokenValue":tokenValue,"tokenIssuer":'google'};
    //
}

export const createAccountWithGoogle = async () => {
    await googleAuth({'creation':true})

    return "createAccountWithGoogle or reload done !!!"
}

export const signOutGoogle = async() => {
    const signOut = async () => {
        try {
          await GoogleSignin.signOut();
          //this.setState({ user: null }); // Remember to remove the user from your app's state as well
        } catch (error) {
          console.error(error);
        }
      };

      await signOut();
}


//================================================================
/**
 * Fetches the credential state for the current user, if any, and updates state on completion.
 */
 async function fetchAndUpdateCredentialState(updateCredentialStateForUser) {
  if (user === null) {
    updateCredentialStateForUser('N/A');
  } else {
    const credentialState = await appleAuth.getCredentialStateForUser(user);
    if (credentialState === appleAuth.State.AUTHORIZED) {
      updateCredentialStateForUser('AUTHORIZED');
    } else {
      updateCredentialStateForUser(credentialState);
    }
  }
}

/**
 * Starts the Sign In flow.
 */
export const onStartAppleLogin = async(updateCredentialStateForUser) =>{
  console.warn('Beginning Apple Authentication');


  //first check if user is logged in via apple
  const testUser = '001472.168f55b0d80b491e91154c9a9f4059ad.1251';
  /*
  const credentialState = await appleAuth.getCredentialStateForUser(testUser);

  console.log('------> credentialState',credentialState,appleAuth.State.AUTHORIZED)

  if(credentialState == appleAuth.State.AUTHORIZED) {
    const appleAuthRequestResponseForRefresh = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.REFRESH
    });
    console.log('ALLEZ stop',appleAuthRequestResponseForRefresh)
  }

*/
/*
const appleAuthRequestResponseForRefresh = await appleAuth.performRequest({
  requestedOperation: appleAuth.Operation.REFRESH,
  requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME], }
);
*/
//console.log('ALLEZ stop',appleAuthRequestResponseForRefresh)

//return false;

  // start a login request
  try {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    console.log('appleAuthRequestResponse', appleAuthRequestResponse);

    console.log('appleAuthRequestResponse stringified', JSON.stringify(appleAuthRequestResponse));

    const {
      user: newUser,
      email,
      nonce,
      identityToken,
      realUserStatus /* etc */,
    } = appleAuthRequestResponse;

    user = newUser;

    console.log("onStartAppleLogin >> user",user)

    fetchAndUpdateCredentialState(updateCredentialStateForUser).catch(error =>
      updateCredentialStateForUser(`Error: ${error.code}`),
    );

    if (identityToken) {
      // e.g. sign in with Firebase Auth using `nonce` & `identityToken`
      console.log(nonce, identityToken);

      //apple granted
      //logWithApple(identityToken)

      return {'idToken':identityToken,'idUser' :user}


    } else {
      // no token - failed sign-in?
      return false;
    }

    if (realUserStatus === appleAuth.UserStatus.LIKELY_REAL) {
      console.log("I'm a real person!");
    }

    console.warn(`Apple Authentication Completed, ${user}, ${email}`);
  } catch (error) {
    console.log("ben ça marche pas",error)
    if (error.code === appleAuth.Error.CANCELED) {
      console.warn('User canceled Apple Sign in.');
    } else {
      console.error(error);
    }
  }
}
export const logWithApple = async() => {

  const appleResponse = await onStartAppleLogin();
  const {userId,idToken} =  appleResponse
  if(idToken) {
    const createResponse = await Api.socialLogin(idToken,'apple').catch((err)=> console.log("socialcreate",err));
    console.log("so it's ok for apple",createResponse)
    await  setSecureSorage('apple',JSON.stringify(appleResponse),'apple')
    console.log("setSecureSorage done")
    return {"tokenValue":idToken,"tokenIssuer":'apple'};
  
  }
  return false;
} 