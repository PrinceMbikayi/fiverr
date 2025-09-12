import React from 'react';

import {TypeDefaultDetails} from '_components/objects/default/defaultDetails';
import { withTheme } from '_theming/themeProvider';
import * as settingsScreens from './settings/objectsSettings';   

   const TypeDynamicSettings = (props) => {  

        console.log("TypeDynamicSettings in brand",props)

        const getDetailComponent = () => { 
            
            const TypeObjectSettings = settingsScreens[props.typeName] || settingsScreens[props.typeName] || TypeDefaultDetails           
            return <TypeObjectSettings newIcon={props.newIcon} itemId= {props.itemId} statuses={props.statuses} {...props}/>            
        }
        return (
            <>
            {
                getDetailComponent()
            }
            </>            
        )
    }
export default withTheme(TypeDynamicSettings);
