import React from 'react';
import { useObject } from '_hooks/object';

import {  SesameGateCommonDetail } from "_brand/templates/components/objects/sesameGate/components/SesameGateCommonDetail";


export const SesameGateDetail = (props) => { 
    const {itemId, setKebab} = props;

    const uObject = useObject(itemId);
    const traits = uObject?.objectDatas?.traits;
    console.log("MY ITEM traits :", traits);

    return(
        < SesameGateCommonDetail itemId={itemId} setKebab={setKebab} traits={traits}/>
    )
}