import React from 'react';

import TypeDefaultSchedule from '_components/objects/default/defaultSchedule';


const TypeDynamicSchedule = (props) => {
  
    const { theme,itemId,typeName,uniType,navigation,navigationParams} = props; 

    return (
       <TypeDefaultSchedule itemId={itemId} typeName={typeName}  uniType={uniType} navigationParams={navigationParams} navigation={navigation}/>       
    )
}

export default TypeDynamicSchedule;