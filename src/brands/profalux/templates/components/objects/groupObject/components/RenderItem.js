import React, { useState } from 'react';
import { View } from 'react-native';
import { ToggleCard } from '_brand/templates/components/objects/common/ToggleCard';
import { useObject } from '_hooks/object';


export const RenderItem = (props)=>{
    const {item, index, bgColor, iconColor, handlePress, IconJS, activeStatus} = props;
   const [active, setActive] = useState(activeStatus);
    const uObject = useObject(item);
    const id = uObject.objectDatas.id;
    const name = uObject.objectDatas.name
    const callBack = (uObject, item, index)=>{
        setActive(!active)
        handlePress(uObject, item, index);
    }
    return(
        <View style={{padding:5}} key={index}>
            <ToggleCard 
                    id ={id}
                    uObject = {uObject}
                    IconJS ={IconJS} 
                    iconSize={30} 
                    iconColor={(activeStatus||active)? bgColor :iconColor}
                    //bgColor={bgColor}
                    bgColor={(activeStatus||active)? iconColor:bgColor} 
                    title={name}
                    viewForm='square' 
                    onPressHandler = {() =>callBack(uObject,item,index)}
                    />
        </View>
    )
}





