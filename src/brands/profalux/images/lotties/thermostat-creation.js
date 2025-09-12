import React, { Component } from 'react';
import LottieView from 'lottie-react-native';

export const ThermostatCreationAnimation = (props) => {
    const {autoPlay = true, loop=true} = props;
    return (     
        <LottieView source={require('./creation-en-cours.json')} autoPlay={autoPlay} loop={loop} />
    )
}
