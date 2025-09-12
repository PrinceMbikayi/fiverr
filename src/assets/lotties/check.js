import React, { Component } from 'react';
import LottieView from 'lottie-react-native';

export const AnimatedCheck = (props) => {
    const {autoPlay = true, loop=true} = props;
    return (     
        <LottieView source={require('_assets/lotties/coche.json')} autoPlay={autoPlay} loop={loop} />
    )
}

