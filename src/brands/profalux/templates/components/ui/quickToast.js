import Toast from 'react-native-toast-message';

/**
 * 
 * @param {*} message 
 * @param {*} textColor 
 * @param {*} bgColor 
 * @param {*} duration 
 */
export function quickToast(type, title, body,duration, onHide=()=>console.log('ON_POPUP_HIDE')){
      Toast.show({
        type: type || 'success',
        text1: title || "",
        text2: `${body}  👋` || "",
        position: 'top',
        topOffset:200,
        visibilityTime: duration || 3000,
        onHide: () => onHide()
      });
}