import React from 'react';
import { useObject } from '_hooks/object';
//import CommonShutterDetailsView from '../../components/CommonShutterDetailsView';
import CommonShutterDetailsView from '_brand/templates/components/objects/shutters/components/CommonShutterDetailsView';



export const StoreLevel2Details = (props) => { 
    const {itemId, setKebab} = props;

    const uObject = useObject(itemId);
    const traits = uObject?.objectDatas?.traits;
    console.log("MY ITEM traits :", traits);

    return(
        <CommonShutterDetailsView itemId={itemId} setKebab={setKebab} traits={traits}/>
    )
}