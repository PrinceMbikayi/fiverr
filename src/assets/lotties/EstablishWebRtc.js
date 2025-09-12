import React, { Component } from 'react';
import LottieView from 'lottie-react-native';


export const AnimatedEstablishWebRtc = (props) => {

    const {autoPlay = true, loop=true} = props;
    return (
        <LottieView source={require('_assets/lotties/loaders/448-ripple-loading-animation.json')} autoPlay={autoPlay} loop={loop} />
    )
}

