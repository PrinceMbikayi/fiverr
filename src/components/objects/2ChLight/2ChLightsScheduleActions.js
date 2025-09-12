import React from 'react';
import {useEffect} from 'react';
import styled from 'styled-components/native';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash';
//-------------
import {ActionSwitch} from '_components/scenarios/actionSwitch';
import * as level2Funcs from '_helpers/level2options';
import { useTheme } from '_theming/themeProvider';

/**
 * 
 * @param {object} props 
 * @param {number} props.scenarioId
 * @param {callback} props.callback
 * @returns 
 */
const Type2ChLightsActions = (props) => {
  
  const actionsSwitchesBase = {
    "S1ONOFF":{actionNames: ['OFF S1','ON S1'],value:true,"label":"ON_OFF"},
    "S2ONOFF":{actionNames: ['OFF S2','ON S2'],value:true,"label":"ON_OFF"}
  }

    const {scenarioId,callback,actionsSwitches} = props;   

    const doSwitchChange = (switchId) => {     
      let switchToModify = {...actionsSwitches[switchId]};
      switchToModify.value = !switchToModify.value;
      const newSwitchesStates = {...actionsSwitches,...{[switchId] : switchToModify}};     
      return newSwitchesStates
    }

    const {theme} = useTheme();
    const { t, i18n } = useTranslation();
    

    const onSwitchToggle = async (switchId) => {
      console.log("switch toggle !!! ",switchId);
      if(callback){
        callback(doSwitchChange(switchId))
      }     
    }
    //-------------------------------------------
    useEffect(() => {
      if(isEmpty(actionsSwitches)) {
        const initSwitches = (scenarioId != -1 && scenarioId != undefined)? level2Funcs.initSwitches(scenarioId,actionsSwitchesBase) : actionsSwitchesBase
       console.log("initSwitches",initSwitches)
        callback(initSwitches);
      }  
    },[])
    //-------------------------------------------
    return (
      <SwitchesWrapper borderColor={theme.divider_on_body}>        
              <ActionSwitch actionText={t('scenarios:ON_OFF_LIGHT')+ " "+"S1"} stateValue ={actionsSwitches?.S1ONOFF?.value} stateName="S1ONOFF" callback={onSwitchToggle}/>
              <ActionSwitch actionText={t('scenarios:ON_OFF_LIGHT')+ " "+"S2"} stateValue ={actionsSwitches?.S2ONOFF?.value} stateName="S2ONOFF" callback={onSwitchToggle}/>        
      </SwitchesWrapper>                   
  )
}
const StyledMainView = styled.View`
                    flex: 1;
                    min-height:150px;                   
                `;

export default Type2ChLightsActions;
// -------- styles and styled ------------------------
const SwitchesWrapper = styled.View`
    border-color:${props => props.borderColor}; 
    border-top-width:1px;
    border-bottom-width:1px;
    padding-bottom:10px;
`;