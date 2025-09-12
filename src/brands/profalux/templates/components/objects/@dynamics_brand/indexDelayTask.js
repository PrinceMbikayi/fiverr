/**
 *  
 *   This Module is a variant of dynamic composition 
 *   It uses render props see infos below
 *   Link : https://softchris.github.io/books/react/render-props/
 * 
 */

import React from 'react';
import {Text,View} from 'react-native';
import { useTranslation } from 'react-i18next';

import { withTheme } from '_theming/themeProvider';
import TypeDefaultDelay from '_components/objects/default/defaultDelay'

import * as actionsSchedules from './actions/objectsActions'


const TypeDynamicDelay = (props) => {
    const { t, i18n } = useTranslation();
    const { theme, navigation,typeName,className,uniType} = props;
  //console.log("TypeDynamicDetails props.newIcon && more =>",props)
    const availableTypes = {
       
        /*light:TypeLightSchedule*/
    };
    let defaultComponent = TypeDefaultDelay


    const injectActions = (props) => {
       
        const description = props.taskObject?.statusDictionary?.__json_description ||  props.taskObject?.description
        const actionsType = 'Type'+(uniType || typeName)+'Actions';        
        const scenarioId = (props.taskObject) ? (description.scenarioId || -1) : -1
        if(actionsSchedules[actionsType]) {
            const SpecificActions = actionsSchedules[actionsType];
            return <SpecificActions  callback={props.callback} itemId={props.itemId} scenarioId={scenarioId}/>;
        }

        return <Text style={{color:'white'}}>No actions for this type ...</Text>

    }




    const TypeObjectDefaultTask = defaultComponent;


    return (
        <>
             <TypeObjectDefaultTask itemId= {props.itemId} {...theme} {...props} renderActions={(props) => injectActions(props)}/>
            
        </>
    )
}

export default withTheme(TypeDynamicDelay);