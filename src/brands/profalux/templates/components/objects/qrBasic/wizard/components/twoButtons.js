import React, { Component } from 'react';
import { View} from 'react-native';
import AccessButton from '_components/forms/accessButton';


/**
 * @typedef Button
 * @property {string} title
 * @property {function} callback
 */


/**
 * 
 * @param {Object} props 
 * @param {Object[]} props.buttons
 * @param {string} props.buttons[].title
 * @param {function} props.buttons[].callback
 * 
 */
export const TwoButtons = (props) => {


    const {buttons} = props;


    return (
        <View style={{flexDirection:'row',justifyContent:'space-between',padding:15,paddingBottom:25}}>
            <View  style={{width:'48%'}}>
                <AccessButton  onPress={buttons[0].callback} title={buttons[0].title}/>
            </View>
            <View  style={{width:'48%'}}>
                <AccessButton  onPress={buttons[1].callback}  title={buttons[1].title}/>
            </View>
        </View> 
    )
}