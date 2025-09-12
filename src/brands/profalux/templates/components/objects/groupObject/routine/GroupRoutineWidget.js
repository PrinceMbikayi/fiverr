import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useObject } from '_hooks/object';
import { useTheme } from '_theming/themeProvider';

// import { RenderLightPlugGroupWidget } from '_brand/templates/components/objects/groupObject/widget/components/RenderLightPlugGroupWidget';
// import { RenderShuttersGroupWidget } from '_brand/templates/components/objects/groupObject/components/RenderShuttersGroupWidget';
// import { GarageCommonWidget } from '_brand/templates/components/objects/garagedoor/components/GarageCommonWidget';
// import { GatesCommonWidget } from '_brand/templates/components/objects/gates/components/GatesCommonWidget';
// import {CommonShutterWidgetView} from '_brand/templates/components/objects/shutters/components/CommonShutterWidgetView';
import { LightPlugGroupRoutine } from '_brand/templates/components/objects/groupObject/routine/LightPlugGroupRoutine';
import { HomoGroupShuttersRoutineWidget } from '_brand/templates/components/objects/groupObject/routine/HomoGroupShuttersRoutineWidget';
import { ShuttersRoutineGroupWidget } from '_brand/templates/components/objects/groupObject/routine/ShuttersRoutineGroupWidget';
import {GarageCommonRoutineWidget} from '_brand/templates/components/objects/garagedoor/routines/GarageCommonRoutineWidget';
import { GatesCommonRoutineWidget } from '_brand/templates/components/objects/gates/routines/GatesCommonRoutineWidget';


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
const LIGHT_TYPES = ["LightEzsp"]
const SWITCH_TYPES = ["SwitchEzsp"]



/**
 * Shutter Widget 
 * 
 * @param {Object} props
 * @param {number} props.itemId
 * 
 * 
 */
export const GroupRoutineWidget = (props)=>{

    const {itemId} = props;
    const { t, i18n } = useTranslation();
    const {theme} = useTheme();  

    const uObject = useObject(itemId);

    const componentsTypes = uObject?.objectDatas?.componentTypes;
    console.log("Component Types :", componentsTypes)
    console.log("GroupName",uObject?.name)
    const traits = uObject?.objectDatas?.traits;
    const grpTypeName = uObject?.widgetReferenceDatas?.typeName
    const uniType = uObject?.objectDatas?.uniType;




    const getWidget = () => {

    let retComponent;
    
    if(componentsTypes?.length == 1){
        if(SHUTTER_TYPES.includes(grpTypeName)){
           retComponent = <HomoGroupShuttersRoutineWidget itemId={itemId} />
        }
        if(GARAGE_TYPES.includes(grpTypeName)){
                retComponent = <GarageCommonRoutineWidget itemId={itemId}/>
        }
        if(GATE_TYPES.includes(grpTypeName)){
               retComponent =<GatesCommonRoutineWidget itemId={itemId}/>
        }
        if(SWITCH_TYPES.includes(grpTypeName)){
           retComponent = <LightPlugGroupRoutine itemId = {itemId} iconSize = {40} isPlug titlePaddingBottom={15}/>
        }
        if(LIGHT_TYPES.includes(grpTypeName)){
            retComponent = <LightPlugGroupRoutine itemId = {itemId} iconSize = {40} isLight/>
        }
    }else if(componentsTypes?.length > 1){ // Heterogeneous Group
        console.log('COMPONENT TYPES :', componentsTypes)
        if(traits?.includes('OnOff')){
            retComponent = <LightPlugGroupRoutine itemId={itemId}/>
        }else{
           retComponent = <ShuttersRoutineGroupWidget itemId={itemId} iconSize={48} />
        }
    }
    
    return retComponent;

    }




    const [content, setContent] = useState(getWidget());

   

    useEffect(()=>{
        console.log("TRAITS CHANGES :", traits);
        setContent(getWidget())
    },[traits])

    console.log("MY UNITYPE GROUP WIDGET VIEW:", grpTypeName, uObject)

    return(
        <View>
            {content}
        </View>
    )


}
