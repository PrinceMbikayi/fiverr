import React, { useMemo } from 'react';
import { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import Animated, { Extrapolate, interpolateNode } from 'react-native-reanimated';

const CustomBackdrop = (props) => {

    console.log("CustomBackdrop",props)
const {animatedIndex,style} = props


  // animated variables
  const animatedOpacity = useMemo(
    () =>
      interpolateNode(animatedIndex, {
        inputRange: [0, 1],
        outputRange: [0, 0.5],
        extrapolate: Extrapolate.CLAMP,
      }),
    [animatedIndex]
  );

  // styles
  const containerStyle = useMemo(
    () => [
      style,
      {
        backgroundColor: '#a8b5eb',
        opacity: animatedOpacity,
        
      },
    ],
    [style, animatedOpacity]
  );

  return <Animated.View style={containerStyle} />;
};

export default CustomBackdrop;