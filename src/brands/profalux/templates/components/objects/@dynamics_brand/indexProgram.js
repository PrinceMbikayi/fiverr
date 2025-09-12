import React from 'react';

import {TypeDefaultDetails} from '_components/objects/default/defaultDetails';
import { withTheme } from '_theming/themeProvider';
import * as programScreens from './programs/objectsProgram';   

   const TypeDynamicProgram = (props) => {  

       

        const getDetailComponent = () => { 
            console.log("TypeDynamicProgram",props)
            const TypeObjectProgram = programScreens[props.typeName] || programScreens[props.typeName] || TypeDefaultDetails           
            return <TypeObjectProgram newIcon={props.newIcon} itemId= {props.itemId} statuses={props.statuses} {...props}/>            
        }
        return (
            <>
            {
                getDetailComponent()
            }
            </>            
        )
    }
export default withTheme(TypeDynamicProgram);
