import React from 'react';

import {TypeDefaultDetails} from '_components/objects/default/defaultDetails';
import { withTheme } from '_theming/themeProvider';
import * as MaintenanceWidgets from './maintenance/objectsMaintenance';   

   const TypeDynamicMaintenance = (props) => {  

        console.log("TypeDynamicMaintenance in brand",props.typeName,MaintenanceWidgets)

        const getMaintenanceComponent = () => { 
            
            const TypeObjectMaintenance = MaintenanceWidgets[props.typeName] || MaintenanceWidgets[props.typeName] || TypeDefaultDetails           
            return <TypeObjectMaintenance newIcon={props.newIcon} itemId= {props.itemId} statuses={props.statuses} {...props}/>            
        }
        return (
            <>
            {
                getMaintenanceComponent()
            }
            </>            
        )
    }
export default withTheme(TypeDynamicMaintenance);
