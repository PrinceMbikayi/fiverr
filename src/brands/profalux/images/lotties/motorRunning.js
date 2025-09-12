import React, { Component } from 'react';
import LottieView from 'lottie-react-native';

const MotorRunning = (props) => {
    const {autoPlay = true, loop=true} = props;
    return (     
        <LottieView source={require('./motorRunning_lottie')} autoPlay={autoPlay} loop={loop} />
    )
}

export default MotorRunning
