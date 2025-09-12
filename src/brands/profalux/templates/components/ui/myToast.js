import Toast from 'react-native-root-toast';

/**
 * 
 * @param {*} message 
 * @param {*} textColor 
 * @param {*} bgColor 
 * @param {*} duration 
 */
export function myToast(message, bgColor, textColor, duration, onHide=()=>console.log('ON_POPUP_HIDE')){
    Toast.show(
      message,
      {
        backgroundColor: bgColor || 'red',
        textColor: textColor || 'white',
        textStyle: { fontSize: 16, fontWeight: '600' },
        position: Toast.positions.CENTER,
        duration: duration || 3000,
        onHide: () => onHide()
      }
    );
}