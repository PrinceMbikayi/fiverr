import React, { Component } from 'react';
import { View} from 'react-native';
import {HeaderWithBack} from '_components/headers/header-with-back';

/**
 * 
 * @param {Object} props 
 * @param {function} props.goBack - a callback
 * @param {string} props.title
 * @param {string} [props.backgroundColor]
 * 
 */
const Header = (props) => {

    const {title,goBack,backgroundColor} = props;

    return (
        <View style={{alignItems:'center',justifyContent:'flex-start',alignSelf:'flex-start'}}>
            <HeaderWithBack title={title} goBack={{action:goBack}} bgColor={backgroundColor} {...props}/>
        </View>
    )
} 

export default  Header