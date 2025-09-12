import React from 'react';
import { useObject } from '_hooks/object';
import CommonShutterDetailsView from '_brand/templates/components/objects/shutters/components/CommonShutterDetailsView';


export const ShutterLevel2Details = (props) => { 
    const {itemId, setKebab} = props;

    const shutterObjectAllInfos = useObject(itemId);
    const traits = shutterObjectAllInfos?.objectDatas?.traits;
    console.log("MY ITEM traits :", traits);

    return(
        <CommonShutterDetailsView itemId={itemId} setKebab={setKebab} traits={traits}/>
    )
}