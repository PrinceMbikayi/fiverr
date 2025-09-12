import React from 'react';
import { useObject } from '_hooks/object';

import { GatesCommonDetail } from "_brand/templates/components/objects/gates/components/GatesCommonDetail";


export const GatesDetail = (props) => { 
    const {itemId, setKebab} = props;

    const uObject = useObject(itemId);
    const traits = uObject?.objectDatas?.traits;
    console.log("MY ITEM traits :", traits);

    return(
        <GatesCommonDetail itemId={itemId} setKebab={setKebab} traits={traits}/>
    )
}