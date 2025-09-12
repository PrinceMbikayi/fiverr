import React from 'react';
import { View,Text} from 'react-native';
import { useSelector} from 'react-redux';

//---------------------------------------------------------

import {getObjectById} from '_helpers/selectors';
import { Assets} from '_helpers/assets';
import {TypeAtHomeProbe} from './atHomeProbe';
import {Graph} from '_components/graphs/graph';

//=========================================================
export const TypeAtHomeProbeDetails = (props) => {
   
    const { theme,itemId} = props;  

    const objectDatas = useSelector(state => getObjectById(state,itemId));       
    const objStatuses = objectDatas.statusDictionary;
    const activeStatusesImages = (itemId)? Assets.getStatusesIcons(itemId) : [];

    return (
            <>
                <Text style={{textAlign:'center'}}>Umii Dev Component Details</Text>
                <View style={{flex:1,maxHeight:200,minHeight:200}}>
                    <TypeAtHomeProbe newIcon={props.newIcon}  {...props} statuses={objStatuses} activeStatusesImages={activeStatusesImages}/>
                </View>
                <Text style={{textAlign:'center'}}>New Graph</Text>
                <Graph objectId={props.itemId}/>                
            </>
    )
}


