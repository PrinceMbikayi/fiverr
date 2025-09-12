import React from 'react';
import { useObject } from '_hooks/object';
import { GarageCommonDetail } from "_brand/templates/components/objects/garagedoor/components/GarageCommonDetail";



export const GarageDetail = (props) => { 
    const {itemId, setKebab} = props;

    const uObject = useObject(itemId);
    const traits = uObject?.objectDatas?.traits;
    console.log("MY ITEM traits :", traits);


    return(
        <GarageCommonDetail itemId={itemId} setKebab={setKebab} traits={traits}/>

    )
}