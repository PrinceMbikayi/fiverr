import React from 'react';
import TwoChLightRender from './2ChLightRender';

/**
 * 
 * @param {Object} props 
 * @param {useObject} props.uObject
 * @returns 
 */
export const Type2ChLight = (props) => {
    
    const { uObject} = props;
    const { statuses,updateStatus,execute,icon,firstItem} = uObject;  
    const  activeStatusesImages = []
   
    const onOffAction = (channel) => {      
        /* Be careful status first letter is lowercase */
        const statusName = 's'+channel;
        const actionName = ((statuses[statusName] == 'on')? 'OFF' : 'ON')+' '+'S'+channel;       
        const nextStatus = (statuses[statusName] == 'on') ? 'off':'on';       
        updateStatus(statusName,nextStatus)
        if(firstItem) updateStatus(statusName,nextStatus,firstItem.id) //dispatch(updateStatus(firstItem.id,statusName,nextStatus));
        execute(actionName,null,true);      
    }
   
    return (
        <TwoChLightRender callback={onOffAction} statuses={statuses} icon={icon} activeStatusesImages={activeStatusesImages}/>
    )
}

