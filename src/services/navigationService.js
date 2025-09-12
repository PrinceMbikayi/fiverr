// NavigationService.js
// Now in V5
import { CommonActions } from '@react-navigation/native';
import { get } from 'dot-prop-immutable';
 
let _navigator;
 
function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}
 
function navigate(routeName, params) {
  console.log("dispatch in NavigationService",_navigator)
  if(_navigator) {
    _navigator.dispatch(
      CommonActions.navigate({
        name : routeName,
        params : params,
      })
    );
  }
 
}
 
 
// add other navigation functions that you need and export them
 
export default {
  navigate,
  setTopLevelNavigator,
  getTopLevelNavigator: () => _navigator,
};