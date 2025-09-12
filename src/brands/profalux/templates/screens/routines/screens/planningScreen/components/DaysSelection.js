import React, {useState, useEffect} from 'react';
import { Text, View, Pressable, StyleSheet, TouchableOpacity} from 'react-native';
import { useTheme } from '_theming/themeProvider';
import styled from 'styled-components/native'
import {useScenario} from '_brand/templates/screens/routines/hook/useScenario'
import { FreeDayRender } from '_brand/templates/screens/routines/screens/planningScreen/components/FreeDayRender';
import { BlockedDaysRender } from '_brand/templates/screens/routines/screens/planningScreen/components/BlockedDaysRender';



export const DaysSelection = (props) => {

    const {onDaySelection, buttons, blockedDays, selectedDays} = props;

    const handleSelectedDay = (dayObject)=>{
       onDaySelection(dayObject)
        //onClickDayObject(dayObject)
    }


    return(
        <View style={{flexDirection:'row', justifyContent:'space-evenly'}}>
            {
                buttons.map((item, index)=>{
                    const id = item?.id
                    const label = item?.label
                    if(blockedDays?.indexOf(item?.id)!=-1){
                        return(
                            <BlockedDaysRender dayObject={item}/>
                        )
                    }else{
                        return (
                        <TouchableOpacity onPress={()=>onDaySelection(item)}>
                            <FreeDayRender 
                                label={label} id ={id} 
                                active={selectedDays?.indexOf(item?.id)!=-1}
                            /> 
                        </TouchableOpacity>
                        )
                    }
            
                })
            }
        </View>
    )

    

}