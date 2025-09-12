import React from 'react';


export  const executeAction = (iconId,uObject)=>{
    const arr = iconId.split('/')
    const actionName = arr.shift()
    const actionValue = Number(arr[0])
    console.log('ICON_ID, ACTION_NAME, ACTION_VALUE :',arr, iconId, actionName, actionValue);
    switch(actionName){
        case "LEVEL":
            uObject?.execute("LEVEL", { mArgs: [{ name: 'level', value: actionValue }] });
            break;

        case "TILT":
            uObject.execute("TILT", { mArgs: [{ name: 'angle', value: actionValue }] });
        default:
            uObject?.execute(actionName);

    }
}