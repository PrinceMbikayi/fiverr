import { firebase } from '@react-native-firebase/auth';
import { appleAuth, AppleButton ,appleAuthAndroid} from '@invertase/react-native-apple-authentication';
import 'react-native-get-random-values'
import { v4 as uuid } from 'uuid'
/**
 * Note the sign in request can error, e.g. if the user cancels the sign-in.
 * Use `appleAuth.Error` to determine the type of error, e.g. `error.code === appleAuth.Error.CANCELED`
 */
export const  onAppleButtonPressFalse = async() => {

  console.log(uuid())
    console.log("onAppleButtonPress 2!!!!!")
  // 1). start a apple sign-in request
  const appleAuthRequestResponse = await appleAuth.performRequest({
    requestedOperation: appleAuth.Operation.LOGIN,
    requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
  }).catch((error) => { console.log("appleAuth Error",error)});

  console.log("appleAuthRequestResponse",appleAuthRequestResponse)
  // 2). if the request was successful, extract the token and nonce
  const { identityToken, nonce } = appleAuthRequestResponse;

  // can be null in some scenarios
  if (identityToken) {
    // 3). create a Firebase `AppleAuthProvider` credential
    const appleCredential = firebase.auth.AppleAuthProvider.credential(identityToken, nonce);

    // 4). use the created `AppleAuthProvider` credential to start a Firebase auth request,
    //     in this example `signInWithCredential` is used, but you could also call `linkWithCredential`
    //     to link the account to an existing user
    const userCredential = await firebase.auth().signInWithCredential(appleCredential);

    // user is now signed in, any Firebase `onAuthStateChanged` listeners you have will trigger
    console.warn(`Firebase authenticated via Apple, UID: ${userCredential.user.uid}`);
  } else {
    // handle this - retry?
  }
}

export const onAppleButtonPress = async () => {
  // Generate secure, random values for state and nonce
  const rawNonce = uuid();
  const state = uuid();

  try {
    // Initialize the module
    appleAuthAndroid.configure({
      // The Service ID you registered with Apple
      clientId: "com.example.client-android",

      // Return URL added to your Apple dev console. We intercept this redirect, but it must still match
      // the URL you provided to Apple. It can be an empty route on your backend as it's never called.
      redirectUri: "https://example.com/auth/callback",

      // [OPTIONAL]
      // Scope.ALL (DEFAULT) = 'email name'
      // Scope.Email = 'email';
      // Scope.Name = 'name';
      scope: appleAuthAndroid.Scope.ALL,

      // [OPTIONAL]
      // ResponseType.ALL (DEFAULT) = 'code id_token';
      // ResponseType.CODE = 'code';
      // ResponseType.ID_TOKEN = 'id_token';
      responseType: appleAuthAndroid.ResponseType.ALL,

      // [OPTIONAL]
      // A String value used to associate a client session with an ID token and mitigate replay attacks.
      // This value will be SHA256 hashed by the library before being sent to Apple.
      // This is required if you intend to use Firebase to sign in with this credential.
      // Supply the response.id_token and rawNonce to Firebase OAuthProvider
      nonce: rawNonce,

      // [OPTIONAL]
      // Unique state value used to prevent CSRF attacks. A UUID will be generated if nothing is provided.
      state,
    });

    const response = await appleAuthAndroid.signIn();
    if (response) {
      const code = response.code; // Present if selected ResponseType.ALL / ResponseType.CODE
      const id_token = response.id_token; // Present if selected ResponseType.ALL / ResponseType.ID_TOKEN
      const user = response.user; // Present when user first logs in using appleId
      const state = response.state; // A copy of the state value that was passed to the initial request.
      console.log("Got auth code", code);
      console.log("Got id_token", id_token);
      console.log("Got user", user);
      console.log("Got state", state);
    }
  } catch (error) {
    if (error && error.message) {
      switch (error.message) {
        case appleAuthAndroid.Error.NOT_CONFIGURED:
          console.log("appleAuthAndroid not configured yet.");
          break;
        case appleAuthAndroid.Error.SIGNIN_FAILED:
          console.log("Apple signin failed.");
          break;
        case appleAuthAndroid.Error.SIGNIN_CANCELLED:
          console.log("User cancelled Apple signin.");
          break;
        default:
          break;
      }
    }
  }
};