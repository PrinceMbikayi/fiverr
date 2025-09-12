import React, { useCallback } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  runOnJS,
  runOnUI,
} from 'react-native-reanimated';
//import { ColorPicker } from '_brand/templates/components/objects/light/components/ColorPicker';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ColorPicker } from './ColorPicker';


export const ColorPickerRender = (props)=>{

    const {initialColor, colors, handleColorChange} = props;
    const COLORS = [
        'red',
        'purple',
        'blue',
        'cyan',
        'green',
        'yellow',
        'orange',
        'black',
        'white',
      ];
      
      const BACKGROUND_COLOR = 'rgba(0,0,0,0.9)';
      
      const { width } = Dimensions.get('window');
      
      const CIRCLE_SIZE = width * 0.3;
      const PICKER_WIDTH = width * 0.8;

  //const pickedColor = useSharedValue(COLORS[0]);
  console.log("INIT---COL :", initialColor)
  const pickedColor = useSharedValue(parseInt(initialColor, 10));
  const onColorChanged = useCallback((color) => {
    'worklet';
    pickedColor.value = color;
    //console.log("WORKLET :", pickedColor.value)
  }, []);

  // const handleStoreColor = useCallback((color) => {
  //   console.log("COLOR CHANGE :", Number(color).toString(16))
  //   handleColorChange(color);
  //   //pickedColor.value = color;
  //   //runOnJS(handleColorChange)(Number(pickedColor.value).toString(16));
  //   //console.log("WORKLET :", pickedColor.value)
  // }, []);

  
  const rStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: pickedColor.value,
    };
  });

  return (
    <>
      <View style={[styles.topContainer,{backgroundColor:'transparent'}]}>
        <Animated.View style={[{width:CIRCLE_SIZE, height:CIRCLE_SIZE, borderRadius:CIRCLE_SIZE/2}, rStyle]} />
      </View>
      <View style={[styles.bottomContainer,{backgroundColor:'transparent'}]}>
        <ColorPicker
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.gradient,{width:PICKER_WIDTH}]}
          maxWidth={PICKER_WIDTH}
          onColorChanged={onColorChanged}
          storeColor = {(color)=>handleColorChange(color)}
        />
      </View>
    </>
  );
}

// export default () => {
//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <App />
//     </GestureHandlerRootView>
//   );
// };

const styles = StyleSheet.create({
  topContainer: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding:20
  },
  gradient: { height: 30,borderRadius: 20 },
});