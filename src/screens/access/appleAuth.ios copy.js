import { firebase } from '@react-native-firebase/auth';
import { appleAuth, AppleButton } from '@invertase/react-native-apple-authentication';
import {logWithApple} from '_api/social';

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
export const onAppleButtonPress = async(updateCredentialStateForUser) =>{
  console.warn('Beginning Apple Authentication');

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

    fetchAndUpdateCredentialState(updateCredentialStateForUser).catch(error =>
      updateCredentialStateForUser(`Error: ${error.code}`),
    );

    if (identityToken) {
      // e.g. sign in with Firebase Auth using `nonce` & `identityToken`
      console.log(nonce, identityToken);

      //apple granted
      logWithApple(identityToken)



    } else {
      // no token - failed sign-in?
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