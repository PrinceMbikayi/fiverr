import React, { Component } from 'react';
import LottieView from 'lottie-react-native';

const CircleFlashinggg = (props) => {
    const {autoPlay = true, loop=true} = props;
    return (     
        <LottieView source={require('./22266-circle-flashing')} autoPlay={autoPlay} loop={loop} />
    )
}

export default CircleFlashinggg
