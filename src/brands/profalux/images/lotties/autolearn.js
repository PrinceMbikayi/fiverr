import React, { Component } from 'react';
import LottieView from 'lottie-react-native';

export const AutoLearnAnimation = (props) => {
    const {autoPlay = true, loop=true} = props;
    return (     
        <LottieView source={require('./lurkingCat.json')} autoPlay={autoPlay} loop={loop} />
    )
}
