import '_brand/templates/components/objects/common/locales'
import React, {useEffect} from 'react';
import { View} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useObject } from '_hooks/object';
import { GroupShuttersDetailView } from '_brand/templates/components/objects/groupObject/details/GroupShuttersDetailView';
import { GarageCommonDetail } from '_brand/templates/components/objects/garagedoor/components/GarageCommonDetail';
import { GatesCommonDetail } from '_brand/templates/components/objects/gates/components/GatesCommonDetail';
import { HomgeneousLightGroupDetail } from './components/HomgeneousLightGroupDetail';
import { HomgeneousPlugGroupDetail } from './components/HomgeneousPlugGroupDetail';
import { HeterogeneousLightPlugDetail } from './components/HeterogeneousLightPlugDetail';
import { SesameGateCommonDetail } from '_brand/templates/components/objects/sesameGate/components/SesameGateCommonDetail';
/**
 * Shutter Widget 
 * 
 * @param {Object} props
 * @param {number} props.itemId
 * 
 * 
 */
export const GroupDetailView = (props)=>{

    const {itemId, setKebab} = props;
    const { t, i18n } = useTranslation();
    const tns = "common";

    const uObject = useObject(itemId);
    const componentsTypes = uObject?.objectDatas?.componentTypes;
    const traits = uObject?.objectDatas?.traits;
    const grpTypeName = uObject?.widgetReferenceDatas?.typeName



    const SHUTTER_TYPES = [
        "Rolling_Shutter_Ezsp",
        "Rolling_Shutter_Profalux",
        "Venetian_Shutter_Ezsp",
        "Shade_Ezsp"
    ]
    const GATE_TYPES = [
        "Gate_Ezsp",
        "Gate_Toggle_Ezsp"
    ]
    const GARAGE_TYPES = [
        "Garage_Door_Ezsp",
        "Garage_Door_Toggle_Ezsp",
    ]
    const SESAME_TYPES = [
    "SesameGate"
    ]
    const LIGHT_TYPES = ["LightEzsp"]
    const SWITCH_TYPES = ["SwitchEzsp"]

    useEffect(()=>{
        console.log("TRAITS CHANGES :", traits)
    },traits)

    console.log("MY UNITYPE :", grpTypeName, uObject)

    let content;

    if(componentsTypes?.length == 1){
        if(SHUTTER_TYPES.includes(grpTypeName)){
            content = <GroupShuttersDetailView itemId={itemId}  setKebab={setKebab} traits={traits}/>
        }
        if(GARAGE_TYPES.includes(grpTypeName)){
                content = <GarageCommonDetail itemId={itemId} setKebab={setKebab} traits={traits}/>
        }
        if(GATE_TYPES.includes(grpTypeName)){
                content = <GatesCommonDetail itemId={itemId} setKebab={setKebab} traits={traits}/>
        }
        // if(SESAME_TYPES.includes(grpTypeName)){
        //         content = <SesameGateCommonDetail itemId={itemId} setKebab={setKebab} traits={traits}/>
        // }
        if(SWITCH_TYPES.includes(grpTypeName)){
            content = <HomgeneousPlugGroupDetail itemId = {itemId} setKebab={setKebab} traits={traits} />
        }
        if(LIGHT_TYPES.includes(grpTypeName)){
            content = <HomgeneousLightGroupDetail itemId = {itemId} setKebab={setKebab} traits={traits} />
        }
    }else if(componentsTypes?.length > 1){ // Heterogeneous Group
        if(traits?.includes('OnOff')){
            content = <HeterogeneousLightPlugDetail itemId={itemId}  setKebab={setKebab} traits={traits}/>
        }else{
            content = <GroupShuttersDetailView itemId={itemId}  setKebab={setKebab} traits={traits}/>
        }
    }

    return(
        <View>
            {content}
        </View>
    )

    
}
