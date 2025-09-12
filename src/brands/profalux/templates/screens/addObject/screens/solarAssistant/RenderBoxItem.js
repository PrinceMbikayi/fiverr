import '_brand/templates/screens/addObject/locales'
import React from 'react';
import { View} from 'react-native';
import { useObject } from '_hooks/object';
import {RenderDonglePresence} from "_brand/templates/screens/addObject/screens/solarAssistant/RenderDonglePresence"
import {retrieveBoxDongles} from "_brand/templates/screens/addObject/utils/retrieveBoxDongles"


export const RenderBoxItem = (props)=>{
    const {boxId, handleBoxChoice, dongleType} = props

    const uBox = useObject(boxId)

    // Get gateway associated dongle of type : dongleType
    const boxComponents = uBox?.objectDatas?.components
    const dongles =  retrieveBoxDongles(boxComponents, dongleType)
    // One box can only have one dongle of a type : Profalux spec for now
    const myBoxDongleId = dongles[0]||-1

    return(
        <View style={{marginBottom:10}}>
            { boxId &&
                <RenderDonglePresence 
                    dongleId = {myBoxDongleId} 
                    boxId={boxId} 
                    handleBoxChoice={handleBoxChoice}
                    dongleType={dongleType}
                />
            }
        </View>
    )  
}