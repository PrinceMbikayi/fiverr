import React, { Component } from 'react';
import LottieView from 'lottie-react-native';


export const AnimatedLoaderMaison = (props) => {

    const {autoPlay = true, loop=true} = props;
    return (
        <LottieView source={require('_assets/lotties/loaders/load.json')} autoPlay={autoPlay} loop={loop} />
    )
}

