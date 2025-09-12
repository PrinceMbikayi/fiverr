import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';


/**
 * Custom hook to disable swipe back gesture in React Navigation.
 * 
 * @param {boolean} [disabled] default true
 */
const useSwipeBackDisabler = (disabled = true) => {

    const enabledSwipe = !(disabled ? true: false); 
    const navigation = useNavigation();

useEffect(()=> {

    
   navigation.setOptions({
          gestureEnabled: enabledSwipe, // Disable swipe gestures
        });
        const parentNavigator = navigation.getParent();

    if (parentNavigator) {
      // Set gestureEnabled on the parent navigator
      parentNavigator.setOptions({
        gestureEnabled: enabledSwipe,
      });
    }
    return () => {
      // Cleanup if needed
       navigation.setOptions({
          gestureEnabled: true, // Disable swipe gestures
        });
      parentNavigator.setOptions({
        gestureEnabled: true, // Re-enable swipe gestures on unmount
      });
    }   

  },[]);

};

export default useSwipeBackDisabler;
