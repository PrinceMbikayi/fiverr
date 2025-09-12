import React,{useState,useEffect} from 'react';
import { View} from 'react-native';
import styled from 'styled-components/native';

import {get2ChLightStatusIcon} from '_helpers/assets/assets';
import TwoChLightRenderSingle from './2ChLightRenderSingle';
import PropTypes from 'prop-types';

/**
 *  OK test JSDOC
 * @category COMPONENTS
 * @subcategory 2CHLIGHT
 * @module TwoChLightRender

 * 
 * @param {object} props
 * @param {string} props.icon
 * @param {string} props.channel
 * @param {string} props.status
 * @param {('meat' | 'veggie' | 'other')} props.eat
 * 
 * 
*/
const TwoChLightRender = (props) => {
    
    const { callback,activeStatusesImages,statuses,icon} = props;  
    const iconSize = 48; 
    
    const [imageStatuses,setImageStatuses] = useState({s1:[],s2:[]});

    useEffect(() => {   
        setImageStatuses({
                            's1':activeStatusesImages.concat(get2ChLightStatusIcon(statuses['s1'])),
                            's2':activeStatusesImages.concat(get2ChLightStatusIcon(statuses['s2']))
                        })
    }, [statuses]);

    //--------------------------------------------
    const onOffAction = (channel) => {      
        callback(channel)
    }
    //-------------------------------------------

    return (
            <StyledMainView style={{flexDirection:'row'}}> 
                <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                    <TwoChLightRenderSingle channel="1" status={statuses.s1} icon={icon} activeStatusesImages={imageStatuses.s1} callback={onOffAction}/>                   
                </View>
                <View style={{width:1,backgroundColor:'#999999',marginTop:(iconSize / 2),marginBottom:(iconSize / 2)}}></View> 
                <View style={{flex:1}}>
                    <TwoChLightRenderSingle   channel="2" status={statuses.s2} icon={icon} activeStatusesImages={imageStatuses.s2} callback={onOffAction}/>                   
                </View>   
            </StyledMainView>
    )
}
const StyledMainView = styled.View`
                    flex: 1;
                    min-height:150px;
                   
                `;

TwoChLightRender.propTypes = {

}


export default TwoChLightRender

