import React, { useCallback } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet } from 'react-native';
import {
  PanGestureHandler,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import Animated, {
  interpolateColor,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

export const ColorPicker = (props)=>{

    const {
        colors,
        start,
        end,
        style,
        maxWidth,
        onColorChanged,
        storeColor,
    } = props;

    const CIRCLE_PICKER_SIZE = 35;
    const INTERNAL_PICKER_SIZE = CIRCLE_PICKER_SIZE / 2;

    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const scale = useSharedValue(1);
    const color = useSharedValue('');

    const adjustedTranslateX = useDerivedValue(() => {
        return Math.min(
        Math.max(translateX.value, 0),
        maxWidth - CIRCLE_PICKER_SIZE
        );
    });

    const onEnd = useCallback(() => {
        'worklet';
        translateY.value = withSpring(0);
        scale.value = withSpring(1);
        if (storeColor) {
            runOnJS(storeColor)(color.value);
        }
    }, []);

    const panGestureEvent = useAnimatedGestureHandler({
        onStart: (_, context) => {
        context.x = adjustedTranslateX.value;
        //context.translateX = event.absoluteX - CIRCLE_PICKER_SIZE;
        },
        onActive: (event, context) => {
        translateX.value = event.translationX + context.x;
        },
        onEnd,
        // onFinish: (e,ctx) =>{
        //     runOnJS(storeColor)(
        //         translateX.value = e.absoluteX //- CIRCLE_PICKER_SIZE
        //     );
        // }
    });


    const tapGestureEvent =
        useAnimatedGestureHandler({
        onStart: (event) => {
            translateY.value = withSpring(-CIRCLE_PICKER_SIZE);
            scale.value = withSpring(1.2);
            translateX.value = withTiming(event.absoluteX - CIRCLE_PICKER_SIZE);
        },
        onEnd,
        // onFinish: (e,ctx) =>{
        //     runOnJS(storeColor)(
        //         translateX.value = e.absoluteX 
        //     );
        // }
        });

    const rStyle = useAnimatedStyle(() => {
        return {
        transform: [
            { translateX: adjustedTranslateX.value },
            { scale: scale.value },
            { translateY: translateY.value },
        ],
        };
    });

    const rInternalPickerStyle = useAnimatedStyle(() => {
        const inputRange = colors.map(
        (_, index) => (index / colors.length) * maxWidth
        );

        const backgroundColor = interpolateColor(
        translateX.value,
        inputRange,
        colors
        );

        onColorChanged?.(backgroundColor);
        if (storeColor) {
            color.value = backgroundColor;
        }

        return {
            backgroundColor,
            };
    });

    return (
        <TapGestureHandler onGestureEvent={tapGestureEvent}>
        <Animated.View>
            <PanGestureHandler onGestureEvent={panGestureEvent}>
            <Animated.View style={{ justifyContent: 'center' }}>
                <LinearGradient
                    colors={colors}
                    start={start}
                    end={end}
                    style={style}
                />
                <Animated.View style={[styles.picker, {width: CIRCLE_PICKER_SIZE, height:CIRCLE_PICKER_SIZE, borderRadius:CIRCLE_PICKER_SIZE/2}, rStyle]}>
                <Animated.View
                    style={[styles.internalPicker, {width: INTERNAL_PICKER_SIZE,height:INTERNAL_PICKER_SIZE, borderRadius:INTERNAL_PICKER_SIZE/2}, rInternalPickerStyle]}
                />
                </Animated.View>
            </Animated.View>
            </PanGestureHandler>
        </Animated.View>
        </TapGestureHandler>
    );
};


const styles = StyleSheet.create({
  picker: {
    position: 'absolute',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  internalPicker: {
    borderWidth: 1.0,
    borderColor: 'rgba(0,0,0,0.2)',
  },
});