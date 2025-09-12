import { useState, useEffect } from 'react';
import {useAppGlobal} from '_helpers/appGlobalProvider';
import { Assets } from '_helpers/assets';

export const useStatuses = (itemId,statuses = {},typeName) => {
   
   const [images, setImages] = useState([]);
   const {getObjectMapped} = useAppGlobal();

    useEffect(()=> {
        const val = statuses.status;       
        const renderAsTypeName = getObjectMapped(typeName)
        // console.log("With Effect => useStatuses changed",typeName,renderAsTypeName,val);
        // const sImages = Assets.getStatusesIcons(referenceItemDatas?.id,val,renderAsTypeName) || [];  
        const newImages =  Assets.getStatusesIcons(itemId,val,renderAsTypeName) || []; 
        // console.log("EEEEE >> newImages",newImages);
        setImages(Assets.getStatusesIcons(itemId,val,renderAsTypeName) || [] )
    },[statuses.status,statuses.forcedStatus])
    return {
        coco2:'voilou ',
        activeStatusesImages:images
    }
}